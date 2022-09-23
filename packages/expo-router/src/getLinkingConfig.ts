import { LinkingOptions, PathConfigMap } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { getAllWebRedirects } from "./aasa";
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
