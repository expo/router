import { LinkingOptions, PathConfigMap } from "@react-navigation/native";
import * as Linking from "expo-linking";

import Constants, { ExecutionEnvironment } from "expo-constants";
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
  const rootURL = Linking.createURL("/");

  return {
    prefixes: [
      /* your linking prefixes */
      rootURL,

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
    async getInitialURL(): Promise<string> {
      const url = await Promise.race<string>([
        (async () => {
          const url = await Linking.getInitialURL();

          // NOTE(EvanBacon): This could probably be wrapped with the development boundary
          // since Expo Go is mostly just used in development.

          // Expo Go is weird and requires the root path to be `/--/`
          if (
            url &&
            Constants.executionEnvironment === ExecutionEnvironment.StoreClient
          ) {
            const parsed = Linking.parse(url);
            // If the URL is defined (default in Expo Go dev apps) and the URL has no path:
            // `exp://192.168.87.39:19000/` then use the default `exp://192.168.87.39:19000/--/`
            if (parsed.path === null || ["", "/"].includes(parsed.path)) {
              return rootURL;
            }
          }
          // The path will be nullish in bare apps when the app is launched from the home screen.
          // TODO(EvanBacon): define some policy around notifications.
          return url ?? rootURL;
        })(),
        new Promise<string>((resolve) =>
          // Timeout in 150ms if `getInitialState` doesn't resolve
          // Workaround for https://github.com/facebook/react-native/issues/25675
          setTimeout(() => resolve(rootURL), 150)
        ),
      ]);
      return url;
    },
    subscribe: (listener) => {
      let callback: (({ url }: { url: string }) => void) | undefined =
        undefined;

      if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
        // This extra work is only done in the Expo Go app.
        callback = ({ url }: { url: string }) => {
          const parsed = Linking.parse(url);
          // If the URL is defined (default in Expo Go dev apps) and the URL has no path:
          // `exp://192.168.87.39:19000/` then use the default `exp://192.168.87.39:19000/--/`
          if (parsed.path === null || ["", "/"].includes(parsed.path)) {
            listener(rootURL);
          } else {
            listener(url);
          }
        };
      } else {
        callback = ({ url }: { url: string }) => listener(url);
      }
      const subscription = Linking.addEventListener("url", callback) as
        | { remove(): void }
        | undefined;

      // Storing this in a local variable stops Jest from complaining about import after teardown
      const removeEventListener = Linking.removeEventListener?.bind(Linking);

      return () => {
        // https://github.com/facebook/react-native/commit/6d1aca806cee86ad76de771ed3a1cc62982ebcd7
        if (subscription?.remove) {
          subscription.remove();
        } else {
          removeEventListener?.("url", callback);
        }
      };
    },
    getStateFromPath,
    getPathFromState,
  };
}
