import * as queryString from "query-string";
import React from "react";

import { RootContainer } from "../ContextNavigationContainer";
import getPathFromState, { State } from "../fork/getPathFromState";
import { useInitialRootStateContext } from "../rootStateContext";
import { HrefObject } from "./href";
import { useLinkingContext } from "./useLinkingContext";

type RouteInfo = Omit<Required<HrefObject>, "query"> & {
  /** Normalized path representing the selected route `/[id]?id=normal` -> `/normal` */
  href: string;
};

function getRouteInfoFromState(
  getPathFromState: (state: State, asPath: boolean) => string,
  state: State
): RouteInfo {
  return {
    href: getPathFromState(state, false),
    ...getNormalizedStatePath(getPathFromState(state, true)),
  };
}

function compareShallowRecords(a: Record<string, any>, b: Record<string, any>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

function compareRouteInfo(a: RouteInfo, b: RouteInfo) {
  return (
    a.href === b.href &&
    a.pathname === b.pathname &&
    compareShallowRecords(a.params, b.params)
  );
}

export function useHref(): RouteInfo {
  const initialRootState = useInitialRootStateContext();
  const getPathFromState = useGetPathFromState();

  const [routeInfo, setRouteInfo] = React.useState<RouteInfo>(
    getRouteInfoFromState(
      getPathFromState,
      // If the root state (from upstream) is not ready, use the hacky initial state.
      // Initial state can be generate because it assumes the linking configuration never changes.
      RootContainer.getRef().getRootState() ?? initialRootState
    )
  );

  const routeInfoRef = React.useRef(routeInfo);

  React.useEffect(() => {
    routeInfoRef.current = routeInfo;
  }, [routeInfo]);

  const maybeUpdateRouteInfo = React.useCallback(
    (state: State) => {
      // Prevent unnecessary updates
      const newRouteInfo = getRouteInfoFromState(getPathFromState, state);
      if (!compareRouteInfo(routeInfoRef.current, newRouteInfo)) {
        setRouteInfo(newRouteInfo);
      }
    },
    [
      // TODO: This probably never changes
      getPathFromState,
    ]
  );

  React.useEffect(() => {
    const rootNavigation = RootContainer.getRef();

    return rootNavigation.addListener("state", ({ data }) => {
      // Attempt to use the complete state from the root, otherwise this will default to
      // sending events from the nearest layout.
      const navigationState =
        rootNavigation.getRootState() ?? (data.state as unknown as State);
      // NOTE(EvanBacon): It's probably worth asserting if the root state is missing here.
      maybeUpdateRouteInfo(navigationState);
    });
  }, [maybeUpdateRouteInfo]);

  return routeInfo;
}

export function useGetPathFromState() {
  const linking = useLinkingContext();

  return React.useCallback(
    (state: Parameters<typeof getPathFromState>[0], asPath: boolean) => {
      return linking.getPathFromState(state, {
        ...linking.config,
        // @ts-expect-error
        preserveDynamicRoutes: asPath,
        preserveFragments: asPath,
      });
    },
    [linking]
  );
}

// TODO: Split up getPathFromState to return all this info at once.
function getNormalizedStatePath(statePath: string): {
  pathname: string;
  params: queryString.ParsedQuery<string>;
} {
  const [pathname, querystring] = statePath.split("?");

  return {
    pathname,
    // TODO: This is not efficient, we should generate based on the state instead
    // of converting to string then back to object
    params: querystring ? queryString.parse(querystring) : {},
  };
}
