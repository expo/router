import { LinkingOptions, PathConfigMap } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { getAllWebRedirects } from "./aasa";
import getPathFromState from "./fork/getPathFromState";
import getStateFromPath from "./fork/getStateFromPath";
import {
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchFragmentName,
} from "./matchers";
import { RouteNode } from "./Route";

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
      Linking.createURL("/"),

      // This ensures that we can redirect correctly when the user comes from an associated domain
      // i.e. iOS Safari banner.
      ...getAllWebRedirects(),
    ],
    config: {
      screens: treeToReactNavigationLinkingRoutes(routes),
    },
    getStateFromPath,
    getPathFromState,
  };
}
