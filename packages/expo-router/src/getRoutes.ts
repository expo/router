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
  getNameFromFilePath,
  getReactNavigationScreenName,
  RouteNode,
} from "./routes";

export function treeToReactNavigationLinkingRoutes(
  nodes: RouteNode[],
  parents: string[] = []
): PathConfigMap<{}> {
  // TODO: Intercept errors, strip invalid routes, and warn instead.
  // Our warnings can be more helpful than upstream since we know the associated file name.
  const firstPass = nodes
    .map((node) => {
      let path = convertDynamicRouteToReactNavigation(node.route);

      return {
        path: path,
        screenName: getReactNavigationScreenName(node.route),
        screens: node.children.length
          ? treeToReactNavigationLinkingRoutes(node.children, [
              ...parents,
              path,
            ])
          : undefined,
      };
    })
    .reduce<PathConfigMap<{}>>((acc, { screenName, ...cur }) => {
      acc[screenName] = {
        ...cur,
      };
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
    const out: RouteNode[] = [];
    // @ts-expect-error
    for (const [key, { ___child, ...obj }] of Object.entries(tree)) {
      const deepDynamicName = matchDeepDynamicRouteName(key);
      const dynamicName = deepDynamicName ?? matchDynamicName(key);

      out.push({
        route: key,
        extras: ___child?.extras,
        component: ___child?.node,
        contextKey: ___child?.contextKey,
        children: toNodeArray(obj),
        dynamic: dynamicName
          ? { name: dynamicName, deep: !!deepDynamicName }
          : null,
      });
    }
    return sortScreens(out);
  }

  return toNodeArray(tree);
}

function sortScreens(screens: RouteNode[]) {
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
  const routes = convert(names);

  // Add all missing navigators
  recurseAndAddMissingNavigators(routes, []);

  // Auto add not found route if it doesn't exist
  appendUnmatchedRoute(routes);

  if (process.env.NODE_ENV === "development") {
    appendDirectoryRoute(routes);
  }

  console.log("routes:", routes);

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
      route.component = require("./views/VirtualNavigator").VirtualNavigator;
      route.generated = true;
      route.extras = {};
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
  routes.push({
    component: Directory,
    children: [],
    extras: { getNavOptions },
    route: "___index",
    contextKey: "./___index.tsx",
    dynamic: null,
    generated: true,
    internal: true,
  });
  return routes;
}

function appendUnmatchedRoute(routes: RouteNode[]) {
  // Auto add not found route if it doesn't exist
  const userDefinedDynamicRoute = getUserDefinedTopLevelCatch(routes);
  if (!userDefinedDynamicRoute) {
    routes.push({
      component: require("./views/Unmatched").Unmatched,
      children: [],
      extras: {},
      route: "[...missing]",
      contextKey: "./[...missing].tsx",
      dynamic: { name: "missing", deep: true },
      generated: true,
      internal: true,
    });
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
