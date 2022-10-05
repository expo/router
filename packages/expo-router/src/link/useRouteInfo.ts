import { LinkingContext } from "@react-navigation/native";
import React from "react";

import getPathFromState from "../fork/getPathFromState";
import { useRootNavigationState } from "../useRootNavigation";

// These values are based on Next.js router
type RouteInfo = {
  /** Normalized path representing the selected route `/[id]?id=normal` -> `/normal` */
  asPath: string;
  /** Path representing the selected route `/[id]` */
  pathname: string;
  /** Query parameters for the path. */
  query: Record<string, any>;
};

export function useRouteInfo(): RouteInfo {
  const state = useRootNavigationState();
  const getPathFromState = useGetPathFromState();

  if (!state) {
    return {
      asPath: "",
      pathname: "",
      query: {},
    };
  }

  const pathname = getNormalizedStatePath(getPathFromState(state, false));
  const asPath = getPathFromState(state, true);

  return {
    asPath,
    ...pathname,
  };
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
