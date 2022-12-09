import * as queryString from "query-string";
import React from "react";

import { RootContainer } from "../ContextNavigationContainer";
import getPathFromState, { State } from "../fork/getPathFromState";
import { HrefObject } from "./href";
import { useLinkingContext } from "./useLinkingContext";

type RouteInfo = Omit<Required<HrefObject>, "query"> & {
  /** Normalized path representing the selected route `/[id]?id=normal` -> `/normal` */
  href: string;
};

function getRouteInfoFromState(
  getPathFromState: (state: State, asPath: boolean) => string,
  state?: State | null
): RouteInfo {
  if (!state) {
    return {
      href: "",
      pathname: "",
      params: {},
    };
  }

  const pathname = getNormalizedStatePath(getPathFromState(state, true));
  const href = getPathFromState(state, false);

  return {
    href,
    ...pathname,
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
  const getPathFromState = useGetPathFromState();

  const navigation = RootContainer.getRef();
  const [routeInfo, setRouteInfo] = React.useState<RouteInfo>(
    getRouteInfoFromState(getPathFromState, navigation?.getRootState())
  );

  const maybeUpdateRouteInfo = React.useCallback(
    (state: State | null) => {
      // Prevent unnecessary updates
      const newRouteInfo = getRouteInfoFromState(getPathFromState, state);
      if (!compareRouteInfo(routeInfo, newRouteInfo)) {
        setRouteInfo(newRouteInfo);
      }
    },
    [getPathFromState, routeInfo]
  );

  React.useEffect(() => {
    if (navigation) {
      maybeUpdateRouteInfo(navigation.getRootState());
      const unsubscribe = navigation.addListener("state", ({ data }) => {
        const navigationState = data.state as unknown as State;
        maybeUpdateRouteInfo(navigationState);
      });
      return unsubscribe;
    }
    return undefined;
  }, [maybeUpdateRouteInfo, navigation]);

  return routeInfo;
}

export function useGetPathFromState() {
  const linking = useLinkingContext();

  return React.useCallback(
    (state: Parameters<typeof getPathFromState>[0], asPath: boolean) => {
      if (!state) {
        return "";
      }

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
