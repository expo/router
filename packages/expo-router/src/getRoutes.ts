import {
  getNameFromFilePath,
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchFragmentName,
} from "./matchers";
import { PickPartial, RouteNode } from "./Route";
import { RequireContext } from "./types";
import { Children } from "./views/Layout";

function getReactNavigationScreenName(name: string) {
  return matchDeepDynamicRouteName(name) || matchDynamicName(name) || name;
}

export function createRouteNode(
  route: PickPartial<RouteNode, "screenName" | "dynamic" | "children">
): RouteNode {
  return {
    screenName: getReactNavigationScreenName(route.route),
    children: [],
    dynamic: null,
    ...route,
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
    return out;
  };

  return toNodeArray(tree);
}

/** Given a Metro context module, return an array of nested routes. */
export function getRoutes(contextModule: RequireContext): RouteNode[] {
  const names = contextModule
    .keys()
    .map((key) => {
      if (process.env.NODE_ENV === "development") {
        // In development, check if the file exports a default component
        // this helps keep things snappy when creating files. In production we load all screens lazily.
        if (!contextModule(key)?.default) {
          return null;
        }
      }

      return {
        normalizedName: getNameFromFilePath(key),
        getComponent() {
          return contextModule(key).default;
        },
        contextKey: key,
        getExtras() {
          const { default: mod, ...extras } = contextModule(key);
          return extras;
        },
      };
    })
    .filter((node) => node);

  const routes = convert(names);

  // Add all missing navigators
  recurseAndAddMissingNavigators(routes, []);

  if (process.env.NODE_ENV !== "production") {
    appendDirectoryRoute(routes);
  }

  // Auto add not found route if it doesn't exist
  appendUnmatchedRoute(routes);

  return routes;
}

// When there's a directory, but no sibling file with the same name, the directory won't work.
// This method ensures that we have a file for every directory (containing valid children).
export function recurseAndAddMissingNavigators(
  routes: RouteNode[],
  parents: string[]
): RouteNode[] {
  routes.forEach((route) => {
    // Route has children but no component and no contextKey (meaning no file path).
    if (route.children.length && route.contextKey == null) {
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
      route.route,
    ]);
    return route;
  });

  return routes;
}

function appendDirectoryRoute(routes: RouteNode[]) {
  if (!routes.length) {
    return routes;
  }
  const { Directory } = require("./views/Directory");
  routes.push(
    createRouteNode({
      getComponent() {
        return Directory;
      },
      getExtras() {
        return {};
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
  const userDefinedDynamicRoute = getUserDefinedDeepDynamicRoute(routes);
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

/**
 * Exposed for testing.
 * @returns a top-level deep dynamic route if it exists, otherwise null.
 */
export function getUserDefinedDeepDynamicRoute(
  routes: RouteNode[]
): RouteNode | null {
  // Auto add not found route if it doesn't exist
  for (const route of routes) {
    const isDeepDynamic = matchDeepDynamicRouteName(route.route);
    if (isDeepDynamic) {
      return route;
    }
    // Recurse through fragment routes
    if (matchFragmentName(route.route)) {
      const child = getUserDefinedDeepDynamicRoute(route.children);
      if (child) {
        return child;
      }
    }
  }
  return null;
}
