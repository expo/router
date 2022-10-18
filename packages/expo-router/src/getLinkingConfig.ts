import { LinkingOptions, PathConfigMap } from "@react-navigation/native";
import { useMemo } from "react";

import { RouteNode } from "./Route";
import { getAllWebRedirects } from "./aasa";
import { useRoutesContext } from "./context";
import {
  addEventListener,
  getInitialURL,
  getRootURL,
  getPathFromState,
  getStateFromPath,
} from "./link/linking";
import {
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchFragmentName,
} from "./matchers";

// `[page]` -> `:page`
// `page` -> `page`
function convertDynamicRouteToReactNavigation(name: string) {
  if (name === "index" || matchFragmentName(name) != null) {
    return "";
  }
  if (matchDeepDynamicRouteName(name) != null) {
    return "*";
  }
  const dynamicName = matchDynamicName(name);

  if (dynamicName != null) {
    return `:${dynamicName}`;
  }

  return name;
}

function parseRouteSegments(segments: string[]): string {
  return (
    segments
      // NOTE(EvanBacon): When there are nested routes without layouts
      // the node.route will be something like `app/home/index`
      // this needs to be split to ensure each segment is parsed correctly.
      .map((segment) => segment.split("/"))
      .flat()
      // Convert each segment to a React Navigation format.
      .map(convertDynamicRouteToReactNavigation)
      // Remove any empty paths from fragments or index routes.
      .filter(Boolean)
      // Join to return as a path.
      .join("/")
  );
}

function reformatRouteNodesAsScreens(
  nodes: RouteNode[],
  parents: string[] = []
): { key: string; name: any }[] {
  return nodes
    .map((node) => {
      if (!node.children.length) {
        // NOTE(EvanBacon): When there are nested routes without layouts
        // the node.route will be something like `app/home/index`
        // this needs to be split to ensure each segment is parsed correctly.
        const components = [...parents, node.route].filter(Boolean);
        const name = parseRouteSegments(components);
        const key = components.join("/");
        return { key, name };
      }

      if (node.generated) {
        console.log("called", node);
        return reformatRouteNodesAsScreens(node.children, [
          ...parents,
          node.route,
        ]);
      }
      const screens = getReactNavigationScreensConfig(node.children);
      const path = parseRouteSegments([node.route]);

      return { key: node.route, name: { path, screens } } as const;
    })
    .flat() as { key: string; name: any }[];
}

export function getReactNavigationScreensConfig(
  nodes: RouteNode[]
): PathConfigMap<object> {
  const screens = reformatRouteNodesAsScreens(nodes);
  return screens.reduce<PathConfigMap<object>>(
    (acc, { key: route, name: current }) => {
      acc[route] = current;
      return acc;
    },
    {}
  );
}

export function getLinkingConfig(routes: RouteNode): LinkingOptions<object> {
  console.log("getLinkingConfig", routes);
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

export function useLinkingConfig(): LinkingOptions<object> {
  const routes = useRoutesContext();
  return useMemo(() => getLinkingConfig(routes), [routes]);
}
