import { LinkingContext } from "@react-navigation/native";
import React from "react";

import { RootContainer } from "../ContextNavigationContainer";
import getPathFromState, { State } from "../fork/getPathFromState";

// These values are based on Next.js router
type RouteInfo = {
  /** Path representing the selected route `/[id]` */
  pathname: string;
  /** Query parameters for the path. */
  query: Record<string, any>;
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
      query: {},
    };
  }

  const pathname = getNormalizedStatePath(getPathFromState(state, false));
  const href = getPathFromState(state, true);

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
    compareShallowRecords(a.query, b.query)
  );
}

export function useHref(): RouteInfo {
  const getPathFromState = useGetPathFromState();

  const navigation = RootContainer.getRef();
  const [routeInfo, setRouteInfo] = React.useState<RouteInfo>(
    getRouteInfoFromState(getPathFromState, null)
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
  const linking = React.useContext(LinkingContext);

  return React.useCallback(
    (state: Parameters<typeof getPathFromState>[0], asPath: boolean) => {
      if (!state) {
        return "";
      }
      if (linking.options?.getPathFromState) {
        return linking.options.getPathFromState(
          state,
          asPath ? linking.options.config : undefined
        );
      }
      return getPathFromState(
        state,
        asPath ? linking.options?.config : undefined
      );
    },
    [linking.options]
  );
}

// TODO: Split up getPathFromState to return all this info at once.
function getNormalizedStatePath(statePath: string) {
  const pathname =
    "/" +
    (statePath
      .split("/")
      .map((value) => decodeURIComponent(value))
      .filter(Boolean)
      .join("/") || "");

  const components = pathname.split("?");

  return {
    pathname: components[0],
    // TODO: This is not efficient, we should generate based on the state instead
    // of converting to string then back to object
    query: parseQueryString(components[1] ?? ""),
  };
}

function parseQueryString(val: string) {
  if (!val) {
    return {};
  }
  const query = {};
  const a = val.split("&");
  for (let i = 0; i < a.length; i++) {
    const b = a[i].split("=");
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "");
  }
  return query;
}
