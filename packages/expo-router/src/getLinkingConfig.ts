import { LinkingOptions } from "@react-navigation/native";

import { RouteNode } from "./Route";
import { getAllWebRedirects } from "./aasa";
import {
  addEventListener,
  getInitialURL,
  getRootURL,
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
function convertDynamicRouteToReactNavigation(name: string) {
  if (name === "index") {
    return "";
  }
  // if (name === "index" || matchFragmentName(name) != null) {
  //   return "";
  // }
  if (matchDeepDynamicRouteName(name) != null) {
    return "*";
  }
  const dynamicName = matchDynamicName(name);

  if (dynamicName != null) {
    return `:${dynamicName}`;
  }

  return name;
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
      // Remove any empty paths from fragments or index routes.
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
    initialRouteName: node.loadRoute().unstable_settings?.initialRouteName,
  };
}

export function getReactNavigationScreensConfig(
  nodes: RouteNode[]
): Record<string, Screen> {
  return Object.fromEntries(
    nodes.map((node) => [node.route, convertRouteNodeToScreen(node)] as const)
  );
}

export function getLinkingConfig(routes: RouteNode): LinkingOptions<object> {
  return {
    prefixes: [
      /* your linking prefixes */
      getRootURL(),

      // This ensures that we can redirect correctly when the user comes from an associated domain
      // i.e. iOS Safari banner.
      ...getAllWebRedirects(),
    ],
    config: {
      screens: getReactNavigationScreensConfig(routes.children),
    },
    // A custom getInitialURL is used on native to ensure the app always starts at
    // the root path if it's launched from something other than a deep link.
    // This helps keep the native functionality working like the web functionality.
    // For example, if you had a root navigator where the first screen was `/settings` and the second was `/index`
    // then `/index` would be used on web and `/settings` would be used on native.
    getInitialURL,
    subscribe: addEventListener,
    getStateFromPath,
    getPathFromState,
  };
}
