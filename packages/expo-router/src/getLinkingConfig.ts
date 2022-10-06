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
  if (matchDeepDynamicRouteName(name) != null) {
    return "*";
  }
  const dynamicName = matchDynamicName(name);

  if (dynamicName != null) {
    return `:${dynamicName}`;
  }

  if (name === "index" || matchFragmentName(name)) {
    return "";
  }

  return name;
}

export function treeToReactNavigationLinkingRoutes(
  nodes: RouteNode[]
): PathConfigMap<object> {
  function collectAll(
    nodes: RouteNode[],
    parents: string[] = []
  ): { key: string; name: any }[] {
    return nodes
      .map((node) => {
        const path = convertDynamicRouteToReactNavigation(node.route);

        if (!node.children.length) {
          const name = [
            ...parents.map(convertDynamicRouteToReactNavigation),
            path,
          ]
            .filter(Boolean)
            .join("/");
          const key = [...parents, node.route].filter(Boolean).join("/");
          return { key, name: name };
        }

        if (node.generated) {
          return collectAll(node.children, [...parents, node.route]);
        }
        const screens = treeToReactNavigationLinkingRoutes(node.children);

        return { key: node.route, name: { path, screens } } as const;
      })
      .flat() as { key: string; name: any }[];
  }

  // TODO: Intercept errors, strip invalid routes, and warn instead.
  // Our warnings can be more helpful than upstream since we know the associated file name.
  return collectAll(nodes).reduce<PathConfigMap<object>>(
    (acc, { key: route, name: current }) => {
      acc[route] = current;
      return acc;
    },
    {}
  );
}

export function getLinkingConfig(routes: RouteNode[]): LinkingOptions<object> {
  return {
    prefixes: [
      /* your linking prefixes */
      getRootURL(),

      // This ensures that we can redirect correctly when the user comes from an associated domain
      // i.e. iOS Safari banner.
      ...getAllWebRedirects(),
    ],
    config: {
      screens: treeToReactNavigationLinkingRoutes(routes),
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
