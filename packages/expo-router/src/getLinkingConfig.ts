import { LinkingOptions, getActionFromState } from "@react-navigation/native";

import { RouteNode } from "./Route";
import {
  addEventListener,
  getInitialURL,
  getPathFromState,
  getStateFromPath,
} from "./link/linking";
import { matchDeepDynamicRouteName, matchDynamicName } from "./matchers";

type Screen =
  | string
  | {
      path: string;
      screens: Record<string, Screen>;
      initialRouteName?: string;
    };

// `[page]` -> `:page`
// `page` -> `page`
function convertDynamicRouteToReactNavigation(segment: string): string {
  // NOTE(EvanBacon): To support shared routes we preserve group segments.
  if (segment === "index") {
    return "";
  }

  const rest = matchDeepDynamicRouteName(segment);
  if (rest != null) {
    return "*" + rest;
  }
  const dynamicName = matchDynamicName(segment);

  if (dynamicName != null) {
    return `:${dynamicName}`;
  }

  return segment;
}

function parseRouteSegments(segments: string): string {
  return (
    // NOTE(EvanBacon): When there are nested routes without layouts
    // the node.route will be something like `app/home/index`
    // this needs to be split to ensure each segment is parsed correctly.
    segments
      .split("/")
      // Convert each segment to a React Navigation format.
      .map(convertDynamicRouteToReactNavigation)
      // Remove any empty paths from groups or index routes.
      .filter(Boolean)
      // Join to return as a path.
      .join("/")
  );
}

function convertRouteNodeToScreen(node: RouteNode): Screen {
  const path = parseRouteSegments(node.route);
  if (!node.children.length) {
    return path;
  }
  const screens = getReactNavigationScreensConfig(node.children);
  return {
    path,
    screens,
    // NOTE(EvanBacon): This is bad because it forces all Layout Routes
    // to be loaded into memory. We should move towards a system where
    // the initial route name is either loaded asynchronously in the Layout Route
    // or defined via a file system convention.
    initialRouteName: node.initialRouteName,
  };
}

export function getReactNavigationScreensConfig(
  nodes: RouteNode[]
): Record<string, Screen> {
  return Object.fromEntries(
    nodes.map((node) => [node.route, convertRouteNodeToScreen(node)] as const)
  );
}

export function getNavigationConfig(routes: RouteNode): {
  initialRouteName?: string;
  screens: Record<string, Screen>;
} {
  return {
    initialRouteName: routes.initialRouteName,
    screens: getReactNavigationScreensConfig(routes.children),
  };
}

export function getLinkingConfig(routes: RouteNode): LinkingOptions<object> {
  return {
    prefixes: [],
    // @ts-expect-error
    config: getNavigationConfig(routes),
    // A custom getInitialURL is used on native to ensure the app always starts at
    // the root path if it's launched from something other than a deep link.
    // This helps keep the native functionality working like the web functionality.
    // For example, if you had a root navigator where the first screen was `/settings` and the second was `/index`
    // then `/index` would be used on web and `/settings` would be used on native.
    getInitialURL,
    subscribe: addEventListener,
    getStateFromPath: getStateFromPathMemoized,
    getPathFromState,

    // Add all functions to ensure the types never need to fallback.
    // This is a convenience for usage in the package.
    getActionFromState,
  };
}

const stateCache = new Map<string, any>();

/** We can reduce work by memoizing the state by the pathname. This only works because the options (linking config) theoretically never change.  */
function getStateFromPathMemoized(
  path: string,
  options: Parameters<typeof getStateFromPath>[1]
) {
  const cached = stateCache.get(path);
  if (cached) {
    return cached;
  }
  const result = getStateFromPath(path, options);
  stateCache.set(path, result);
  return result;
}
