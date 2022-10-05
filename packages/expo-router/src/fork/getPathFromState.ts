import {
  validatePathConfig,
  PathConfig,
  PathConfigMap,
} from "@react-navigation/core";
import type {
  NavigationState,
  PartialState,
  Route,
} from "@react-navigation/routers";
import * as queryString from "query-string";

import { matchDeepDynamicRouteName } from "../matchers";

type Options<ParamList extends object> = {
  initialRouteName?: string;
  screens: PathConfigMap<ParamList>;
};

export type State =
  | NavigationState
  | Omit<PartialState<NavigationState>, "stale">;

type StringifyConfig = Record<string, (value: any) => string>;

type ConfigItem = {
  pattern?: string;
  stringify?: StringifyConfig;
  screens?: Record<string, ConfigItem>;
};

const getActiveRoute = (state: State): { name: string; params?: object } => {
  const route =
    typeof state.index === "number"
      ? state.routes[state.index]
      : state.routes[state.routes.length - 1];

  if (route.state) {
    return getActiveRoute(route.state);
  }

  if (route && isInvalidParams(route.params)) {
    return getActiveRoute(createFakeState(route.params));
  }

  return route;
};

function createFakeState(params: StateAsParams) {
  return {
    stale: false,
    type: "UNKNOWN",
    key: "UNKNOWN",
    index: 0,
    routeNames: [],
    routes: [
      {
        key: "UNKNOWN",
        name: params.screen,
        params: params.params,
        path: params.path,
      },
    ],
  };
}

/**
 * Utility to serialize a navigation state object to a path string.
 *
 * @example
 * ```js
 * getPathFromState(
 *   {
 *     routes: [
 *       {
 *         name: 'Chat',
 *         params: { author: 'Jane', id: 42 },
 *       },
 *     ],
 *   },
 *   {
 *     screens: {
 *       Chat: {
 *         path: 'chat/:author/:id',
 *         stringify: { author: author => author.toLowerCase() }
 *       }
 *     }
 *   }
 * )
 * ```
 *
 * @param state Navigation state to serialize.
 * @param options Extra options to fine-tune how to serialize the path.
 * @returns Path representing the state, e.g. /foo/bar?count=42.
 */
export default function getPathFromState<ParamList extends object>(
  state: State,
  options?: Options<ParamList>
): string {
  if (state == null) {
    throw Error(
      "Got 'undefined' for the navigation state. You must pass a valid state object."
    );
  }

  if (options) {
    validatePathConfig(options);
  }

  // Create a normalized configs object which will be easier to use
  const configs: Record<string, ConfigItem> = options?.screens
    ? createNormalizedConfigs(options?.screens)
    : {};

  let path = "/";
  let current: State | undefined = state;

  const allParams: Record<string, any> = {};

  while (current) {
    let index = typeof current.index === "number" ? current.index : 0;
    let route = current.routes[index] as Route<string> & {
      state?: State;
    };
    // NOTE(EvanBacon): Fill in current route using state that was passed as params.
    if (!route.state && isInvalidParams(route.params)) {
      route.state = createFakeState(route.params);
    }

    let pattern: string | undefined;

    let focusedParams: Record<string, any> | undefined;
    const focusedRoute = getActiveRoute(state);
    let currentOptions = configs;
    // Keep all the route names that appeared during going deeper in config in case the pattern is resolved to undefined
    const nestedRouteNames = [];

    let hasNext = true;

    while (route.name in currentOptions && hasNext) {
      pattern = currentOptions[route.name].pattern;

      // @ts-expect-error
      nestedRouteNames.push(route.name);

      if (route.params) {
        const stringify = currentOptions[route.name]?.stringify;

        const currentParams = Object.fromEntries(
          Object.entries(route.params).map(([key, value]) => [
            key,
            stringify?.[key] ? stringify[key](value) : String(value),
          ])
        );

        if (pattern) {
          Object.assign(allParams, currentParams);
        }

        if (focusedRoute === route) {
          // If this is the focused route, keep the params for later use
          // We save it here since it's been stringified already
          focusedParams = { ...currentParams };

          pattern
            ?.split("/")
            .filter((p) => p.startsWith(":") || p === "*")
            // eslint-disable-next-line no-loop-func
            .forEach((p) => {
              let name: string;
              if (p === "*") {
                // NOTE(EvanBacon): Drop the param name matching the wildcard route name -- this is specific to Expo Router.
                name = matchDeepDynamicRouteName(route.name) ?? route.name;
              } else {
                name = getParamName(p);
              }

              // Remove the params present in the pattern since we'll only use the rest for query string
              if (focusedParams) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete focusedParams[name];
              }
            });
        }
      }

      // If there is no `screens` property or no nested state, we return pattern
      if (!currentOptions[route.name].screens || route.state === undefined) {
        hasNext = false;
      } else {
        index =
          typeof route.state.index === "number"
            ? route.state.index
            : route.state.routes.length - 1;

        const nextRoute = route.state.routes[index];
        const nestedConfig = currentOptions[route.name].screens;

        // if there is config for next route name, we go deeper
        if (nestedConfig && nextRoute.name in nestedConfig) {
          route = nextRoute as Route<string> & { state?: State };
          currentOptions = nestedConfig;
        } else {
          // If not, there is no sense in going deeper in config
          hasNext = false;
        }
      }
    }

    if (pattern === undefined) {
      pattern = nestedRouteNames.join("/");
    }

    if (currentOptions[route.name] !== undefined) {
      path += pattern
        .split("/")
        .map((p, i) => {
          const name = getParamName(p);

          // We don't know what to show for wildcard patterns
          // Showing the route name seems ok, though whatever we show here will be incorrect
          // Since the page doesn't actually exist
          if (p === "*") {
            if (i === 0) {
              // This can occur when a wildcard matches all routes and the given path was `/`.
              return route.path ?? "";
            }
            // remove existing segments from route.path and return it
            // this is used for nested wildcard routes. Without this, the path would add
            // all nested segments to the beginning of the wildcard route.
            const path = route.path
              ?.split("/")
              .slice(i + 1)
              .join("/");
            return path ?? "";
          }

          // If the path has a pattern for a param, put the param in the path
          if (p.startsWith(":")) {
            const value = allParams[name];

            if (value == null) {
              // Optional params without value assigned in route.params should be ignored
              return "";
            }
            return value;
          }

          return encodeURIComponent(p);
        })
        .join("/");
    } else {
      path += encodeURIComponent(route.name);
    }

    if (!focusedParams) {
      focusedParams = focusedRoute.params;
    }

    if (route.state) {
      path += "/";
    } else if (focusedParams) {
      for (const param in focusedParams) {
        if (focusedParams[param] === "undefined") {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete focusedParams[param];
        }
      }

      const query = queryString.stringify(focusedParams, { sort: false });

      if (query) {
        path += `?${query}`;
      }
    }

    current = route.state;
  }

  // Remove multiple as well as trailing slashes
  path = path.replace(/\/+/g, "/");
  path = path.length > 1 ? path.replace(/\/$/, "") : path;

  return path;
}

type StateAsParams = {
  initial: boolean;
  path: string;
  screen: string;
  params: Record<string, any>;
};

// TODO: Make StackRouter not do this...
// Detect if the params came from StackRouter using `params` to pass around internal state.
function isInvalidParams(
  params?: Record<string, any>
): params is StateAsParams {
  return (
    !!params &&
    "initial" in params &&
    "path" in params &&
    "screen" in params &&
    "params" in params &&
    typeof params.params === "object" &&
    !!params.params
  );
}

const getParamName = (pattern: string) =>
  pattern.replace(/^:/, "").replace(/\?$/, "");

const joinPaths = (...paths: string[]): string =>
  ([] as string[])
    .concat(...paths.map((p) => p.split("/")))
    .filter(Boolean)
    .join("/");

const createConfigItem = (
  config: PathConfig<object> | string,
  parentPattern?: string
): ConfigItem => {
  if (typeof config === "string") {
    // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
    const pattern = parentPattern ? joinPaths(parentPattern, config) : config;

    return { pattern };
  }

  if (config.exact && config.path === undefined) {
    throw new Error(
      "A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`."
    );
  }

  // If an object is specified as the value (e.g. Foo: { ... }),
  // It can have `path` property and `screens` prop which has nested configs
  const pattern =
    config.exact !== true
      ? joinPaths(parentPattern || "", config.path || "")
      : config.path || "";

  const screens = config.screens
    ? createNormalizedConfigs(config.screens, pattern)
    : undefined;

  return {
    // Normalize pattern to remove any leading, trailing slashes, duplicate slashes etc.
    pattern: pattern?.split("/").filter(Boolean).join("/"),
    stringify: config.stringify,
    screens,
  };
};

const createNormalizedConfigs = (
  options: PathConfigMap<object>,
  pattern?: string
): Record<string, ConfigItem> =>
  Object.fromEntries(
    Object.entries(options).map(([name, c]) => {
      const result = createConfigItem(c, pattern);

      return [name, result];
    })
  );
