import React from "react";
import { Platform } from "react-native";

import { getRouteInfoFromState } from "./LocationProvider";
import getPathFromState, {
  getPathDataFromState,
} from "./fork/getPathFromState";
import { ResultState } from "./fork/getStateFromPath";
import { getLinkingConfig } from "./getLinkingConfig";
import { getRoutes } from "./getRoutes";
import {
  ExpoRouterContextType,
  OnboardingExpoRouterContextType,
} from "./hooks";
import { RequireContext } from "./types";
// import URL from "url-parse";

export type ExpoRootProps = {
  context: RequireContext;
  location?: URL;
};

const initialUrl =
  Platform.OS === "web" && typeof window !== "undefined"
    ? new URL(window.location.href)
    : undefined;

/** @private */
export function createExpoRouterContext({
  context,
  location = initialUrl,
}: ExpoRootProps) {
  const routeNode = getRoutes(context);

  // No app dir exists
  if (!routeNode) {
    return {
      routeNode,
      linking: { prefixes: [] },
      initialState: undefined,
      getRouteInfo() {
        throw new Error("invalid");
      },
    };
  }

  const linking = getLinkingConfig(routeNode);
  let initialState: ResultState | undefined;

  if (location) {
    initialState = linking.getStateFromPath?.(
      location.pathname + location.search,
      linking.config
    );
  }

  function getRouteInfo(state: ResultState) {
    return getRouteInfoFromState(
      (state: Parameters<typeof getPathFromState>[0], asPath: boolean) => {
        return getPathDataFromState(state, {
          screens: [],
          ...linking.config,
          preserveDynamicRoutes: asPath,
          preserveGroups: asPath,
        });
      },
      state
    );
  }

  // This looks redundant but it makes TypeScript correctly infer the union return type.
  return {
    routeNode,
    linking,

    initialState,
    getRouteInfo,
  };
}

export function useCreateExpoRouterContext(props: ExpoRootProps) {
  return React.useMemo<
    | Omit<ExpoRouterContextType, "navigationRef">
    | Omit<OnboardingExpoRouterContextType, "navigationRef">
  >(() => {
    return createExpoRouterContext(props);
  }, [props.context, props.location]);
}
