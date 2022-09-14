import * as Linking from "expo-linking";
import { ReactNode } from "react";

import {
  convertDynamicRouteToReactNavigation,
  getNameFromFilePath,
  matchDynamicName,
} from "./routes";
import { getAllWebRedirects } from "./aasa";

type Node = {
  route: string;
  extras: Record<string, any>;
  component: ReactNode;
  children: Node[];
  dynamic?: boolean;
  /** require.context key, used for matching children. */
  contextKey: string;
};

function treeToReactNavigationLinkingRoutes(nodes: Node[], depth = 0) {
  return nodes
    .map((node) => {
      let path = convertDynamicRouteToReactNavigation(node.route);
      const exact = path !== node.route;

      const routingInfo = {
        path,
        screens: node.children.length
          ? treeToReactNavigationLinkingRoutes(node.children, depth + 1)
          : undefined,
      };

      if (exact) {
        routingInfo.exact = exact;
      }

      return routingInfo;
    })
    .reduce((acc, cur) => {
      const path = cur.path === "index" ? "" : cur.path;
      if (!cur.screens) {
        acc[cur.path] = path;
      } else {
        acc[cur.path] = {
          ...cur,
          path,
        };
      }
      return acc;
    }, {});
}

export function getLinkingConfig(routes: Node[]) {
  const prefix = Linking.createURL("/");

  // This ensures that we can redirect correctly when the user comes from an associated domain
  // i.e. iOS Safari banner.
  const appSiteAssociations = getAllWebRedirects();

  if (appSiteAssociations.length) {
    console.log("App Site Associations:", appSiteAssociations);
  }
  const screens = treeToReactNavigationLinkingRoutes(
    // Skip first route which doesn't have a navigator
    routes[0].children
  );

  return {
    prefixes: [
      /* your linking prefixes */
      prefix,
      ...appSiteAssociations,
    ],
    config: {
      screens,
    },
  };
}

// Recursively convert flat map of file paths to tree
function convert(files: { route: string; node: any }[]) {
  const tree = {};
  for (const file of files) {
    const parts = file.route.split("/");
    let current = tree;
    for (const part of parts) {
      current = current[part] = current[part] || {};
    }
    // @ts-expect-error
    current.___child = file;
  }

  function toNodeArray(tree) {
    const out: Node[] = [];
    // @ts-expect-error
    for (const [key, { ___child, ...obj }] of Object.entries(tree)) {
      out.push({
        route: key,
        extras: ___child?.extras,
        component: ___child?.node,
        contextKey: ___child?.contextKey,
        children: toNodeArray(obj),
        dynamic: !!matchDynamicName(key),
      });
    }
    return sortScreens(out);
  }

  return toNodeArray(tree);
}

function sortScreens(screens: Node[]) {
  return screens.sort(
    ({ route, dynamic }, { route: idB, dynamic: isVariadicB }) => {
      if (route === "index") return -1;
      if (idB === "index") return 1;
      // Sort variadic to be last
      if (dynamic) return 1;
      if (isVariadicB) return -1;

      // if (a > b) return 1;
      // if (a < b) return -1;
      return 0;
    }
  );
}

export function getRoutes(pages) {
  const names = pages
    .keys()
    .map((key) => {
      const _import = pages(key);
      if (!_import?.default) return null;
      const { default: mod, ...extras } = _import;
      return {
        route: getNameFromFilePath(key),
        node: _import.default,
        contextKey: key,
        extras,
      };
    })
    .filter((node) => node);
  return convert(names);
}
