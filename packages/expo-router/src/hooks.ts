import {
  NavigationContainerRefWithCurrent,
  NavigationRouteContext,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import React from "react";

import { UrlObject } from "./LocationProvider";
import { RouteNode } from "./Route";
import { ResultState } from "./fork/getStateFromPath";
import { ExpoLinkingOptions } from "./getLinkingConfig";

type SearchParams = Record<string, string | string[]>;

export type ExpoRouterContextType = {
  routeNode: RouteNode;
  linking: ExpoLinkingOptions;
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
  initialState: ResultState | undefined;
  getRouteInfo: (state: ResultState) => UrlObject;
};

// If there is no routeNode we should show the onboarding screen
export type OnboardingExpoRouterContextType = Omit<
  ExpoRouterContextType,
  "routeNode"
> & { routeNode: null };

export const ExpoRouterContext = React.createContext<
  ExpoRouterContextType | undefined
>(undefined);

export type RootStateContextType = {
  state?: ResultState;
  routeInfo?: UrlObject;
};

export const RootStateContext = React.createContext<RootStateContextType>({});

export function useRootNavigationState() {
  return React.useContext(RootStateContext);
}

export function useRouteInfo() {
  return React.useContext(RootStateContext).routeInfo!;
}

export function useExpoRouterContext() {
  return React.useContext(ExpoRouterContext)!;
}

export function useRootNavigation() {
  const { navigationRef } = useExpoRouterContext();
  return navigationRef.current;
}

export function useLinkingContext() {
  return useExpoRouterContext().linking;
}

/**
 * @private
 * @returns the current global pathname with query params attached. This may change in the future to include the hostname from a predefined universal link, i.e. `/foobar?hey=world` becomes `https://acme.dev/foobar?hey=world`
 */
export function useUnstableGlobalHref(): string {
  return useRouteInfo().unstable_globalHref;
}

/**
 * Get a list of selected file segments for the currently selected route. Segments are not normalized, so they will be the same as the file path. e.g. /[id]?id=normal -> ["[id]"]
 *
 * `useSegments` can be typed using an abstract.
 * Consider the following file structure, and strictly typed `useSegments` function:
 *
 * ```md
 * - app
 *   - [user]
 *     - index.js
 *     - followers.js
 *   - settings.js
 * ```
 * This can be strictly typed using the following abstract:
 *
 * ```ts
 * const [first, second] = useSegments<['settings'] | ['[user]'] | ['[user]', 'followers']>()
 * ```
 */
export function useSegments<
  TSegments extends string[] = string[]
>(): TSegments {
  return useRouteInfo().segments as TSegments;
}

/** @returns global selected pathname without query parameters. */
export function usePathname(): string {
  return useRouteInfo().pathname;
}

/**
 * Get the globally selected query parameters, including dynamic path segments. This function will update even when the route is not focused.
 * Useful for analytics or other background operations that don't draw to the screen.
 *
 * When querying search params in a stack, opt-towards using `useLocalSearchParams` as these will only
 * update when the route is focused.
 *
 * @see `useLocalSearchParams`
 */
export function useGlobalSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return useRouteInfo().params as Partial<TParams>;
}

/** @deprecated renamed to `useGlobalSearchParams` */
export function useSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return useRouteInfo().params as Partial<TParams>;
}

/**
 * Returns the URL search parameters for the contextually focused route. e.g. `/acme?foo=bar` -> `{ foo: "bar" }`.
 * This is useful for stacks where you may push a new screen that changes the query parameters.
 *
 * To observe updates even when the invoking route is not focused, use `useGlobalSearchParams()`.
 */
export function useLocalSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return (useOptionalLocalRoute()?.params ?? ({} as any)) as Partial<TParams>;
}

function useOptionalLocalRoute<T extends RouteProp<ParamListBase>>():
  | T
  | undefined {
  const route = React.useContext(NavigationRouteContext);
  return route as T | undefined;
}
