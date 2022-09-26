import { LinkingOptions, PathConfigMap } from "@react-navigation/native";
import { useMemo } from "react";

import { getAllWebRedirects } from "./aasa";

import {
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchFragmentName,
} from "./matchers";
import { RouteNode } from "./Route";
import {
  addEventListener,
  getInitialURL,
  getRootURL,
  getPathFromState,
  getStateFromPath,
} from "./linking";
import { useRoutesContext } from "./context";

// `[page]` -> `:page`
// `page` -> `page`
function convertDynamicRouteToReactNavigation(name: string) {
  if (matchDeepDynamicRouteName(name)) {
    return "*";
  }
  const dynamicName = matchDynamicName(name);

  if (dynamicName) {
    return `:${dynamicName}`;
  }

  if (name === "index" || matchFragmentName(name)) {
    return "";
  }

  return name;
}

export function treeToReactNavigationLinkingRoutes(
  nodes: RouteNode[],
  parents: string[] = []
): PathConfigMap<{}> {
  // TODO: Intercept errors, strip invalid routes, and warn instead.
  // Our warnings can be more helpful than upstream since we know the associated file name.
  const firstPass = nodes
    .map((node) => {
      const path = convertDynamicRouteToReactNavigation(node.route);

      if (!node.children.length) {
        return [node.route, path];
      }

      const screens = treeToReactNavigationLinkingRoutes(node.children, [
        ...parents,
        path,
      ]);

      return [node.route, { path, screens }] as const;
    })
    .reduce<PathConfigMap<{}>>((acc, [route, current]) => {
      acc[route] = current;
      return acc;
    }, {});

  return firstPass;
}

export function getLinkingConfig(routes: RouteNode[]): LinkingOptions<{}> {
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
    getInitialURL: getInitialURL,
    subscribe: addEventListener,
    getStateFromPath,
    getPathFromState,
  };
}

export function useLinkingConfig(): LinkingOptions<{}> {
  const routes = useRoutesContext();
  return useMemo(() => getLinkingConfig(routes), [routes]);
}
