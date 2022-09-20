import * as Linking from "expo-linking";
import { LinkingOptions, PathConfigMap } from "@react-navigation/native";

import { getAllWebRedirects } from "./aasa";
import {
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchFragmentName,
} from "./matchers";
import {
  convertDynamicRouteToReactNavigation,
  createRouteNode,
  getNameFromFilePath,
  RouteNode,
} from "./routes";
import { Children } from "./Navigator";

export function treeToReactNavigationLinkingRoutes(
  nodes: RouteNode[],
  parents: string[] = []
): PathConfigMap<{}> {
  // TODO: Intercept errors, strip invalid routes, and warn instead.
  // Our warnings can be more helpful than upstream since we know the associated file name.
  const firstPass = nodes
    .map((node) => {
      let path = convertDynamicRouteToReactNavigation(node.route);

      return [
        node.screenName,
        {
          path: path,
          screens: node.children.length
            ? treeToReactNavigationLinkingRoutes(node.children, [
                ...parents,
                path,
              ])
            : undefined,
        },
      ] as const;
    })
    .reduce<PathConfigMap<{}>>((acc, [screenName, current]) => {
      acc[screenName] = current;
      return acc;
    }, {});

  return firstPass;
}

export function getLinkingConfig(routes: RouteNode[]): LinkingOptions<{}> {
  return {
    prefixes: [
      /* your linking prefixes */
      Linking.createURL("/"),

      // This ensures that we can redirect correctly when the user comes from an associated domain
      // i.e. iOS Safari banner.
      ...getAllWebRedirects(),
    ],
    config: {
      screens: treeToReactNavigationLinkingRoutes(routes),
    },
  };
}

// Recursively convert flat map of file paths to tree
function convert(
  files: (Pick<RouteNode, "contextKey" | "getComponent" | "getExtras"> & {
    normalizedName: string;
  })[]
): RouteNode[] {
  const tree = {};
  for (const file of files) {
    const parts = file.normalizedName.split("/");
    let current = tree;
    for (const part of parts) {
      current = current[part] = current[part] || {};
    }
    // @ts-expect-error
    current.___child = file;
  }

  const toNodeArray = (tree): RouteNode[] => {
    const out: RouteNode[] = [];
    // @ts-expect-error
    for (const [key, { ___child, ...obj }] of Object.entries(tree)) {
      const deepDynamicName = matchDeepDynamicRouteName(key);
      const dynamicName = deepDynamicName ?? matchDynamicName(key);

      out.push(
        createRouteNode({
          route: key,
          getExtras: ___child?.getExtras,
          getComponent: ___child?.getComponent,
          contextKey: ___child?.contextKey,
          children: toNodeArray(obj),
          dynamic: dynamicName
            ? { name: dynamicName, deep: !!deepDynamicName }
            : null,
        })
      );
    }
    return sortRoutes(out);
  };

  return toNodeArray(tree);
}

function sortRoutes(screens: RouteNode[]): RouteNode[] {
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

export function getRoutes(pages): RouteNode[] {
  const names = pages
    .keys()
    .map((key) => {
      // In development, check if the file exports a default component
      // this helps keep things snappy when creating files. In production we load all screens lazily.
      if (process.env.NODE_ENV === "development") {
        const _import = pages(key);
        if (!_import?.default) {
          return null;
        }
      }

      return {
        normalizedName: getNameFromFilePath(key),
        getComponent() {
          return pages(key).default;
        },
        contextKey: key,
        getExtras() {
          const { default: mod, ...extras } = pages(key);
          return extras;
        },
      };
    })
    .filter((node) => node);

  const routes = convert(names);

  // Add all missing navigators
  recurseAndAddMissingNavigators(routes, []);

  // Auto add not found route if it doesn't exist
  appendUnmatchedRoute(routes);

  if (process.env.NODE_ENV === "development") {
    appendDirectoryRoute(routes);
  }

  return routes;
}

// When there's a directory, but no sibling file with the same name, the directory won't work.
// This method ensures that we have a file for every directory (containing valid children).
function recurseAndAddMissingNavigators(
  routes: RouteNode[],
  parents: RouteNode[]
): RouteNode[] {
  routes.forEach((route) => {
    // Route has children but no component and no contextKey (meaning no file path).
    if (route.children.length && !route.contextKey) {
      route.getComponent = () => Children;
      route.generated = true;
      route.getExtras = () => ({});
      route.contextKey = [".", ...parents, route.route + ".tsx"]
        .filter(Boolean)
        .join("/");
      // TODO: Handle if the directory is dynamic.
    }

    route.children = recurseAndAddMissingNavigators(route.children, [
      ...parents,
      route,
    ]);
    return route;
  });

  return routes;
}

function appendDirectoryRoute(routes: RouteNode[]) {
  const { Directory, getNavOptions } = require("./views/Directory");
  routes.push(
    createRouteNode({
      getComponent() {
        return Directory;
      },
      getExtras() {
        return { getNavOptions };
      },
      route: "__index",
      contextKey: "./__index.tsx",
      generated: true,
      internal: true,
    })
  );
  return routes;
}

function appendUnmatchedRoute(routes: RouteNode[]) {
  // Auto add not found route if it doesn't exist
  const userDefinedDynamicRoute = getUserDefinedTopLevelCatch(routes);
  if (!userDefinedDynamicRoute) {
    routes.push(
      createRouteNode({
        getComponent() {
          return require("./views/Unmatched").Unmatched;
        },
        getExtras() {
          return {};
        },
        route: "[...404]",
        contextKey: "./[...404].tsx",
        dynamic: { name: "404", deep: true },
        generated: true,
        internal: true,
      })
    );
  }
  return routes;
}

function getUserDefinedTopLevelCatch(routes: RouteNode[]) {
  // Auto add not found route if it doesn't exist
  for (const route of routes) {
    const isDeepDynamic = matchDeepDynamicRouteName(route.route);
    if (isDeepDynamic) {
      return route;
    }
    // Recurse through fragment routes
    if (matchFragmentName(route.route)) {
      const child = getUserDefinedTopLevelCatch(route.children);
      if (child) {
        return child;
      }
    }
  }
  return null;
}
