import {
  NavigationContainerRefWithCurrent,
  useNavigationContainerRef,
  useRoute,
} from "@react-navigation/native";
import React from "react";

import { getRouteInfoFromState } from "./LocationProvider";
import { RouteNode } from "./Route";
import getPathFromState, {
  getPathDataFromState,
} from "./fork/getPathFromState";
import { ResultState } from "./fork/getStateFromPath";
import { ExpoLinkingOptions } from "./getLinkingConfig";
import { useNavigation } from "./useNavigation";

type SearchParams = Record<string, string | string[]>;

export type ExpoRouteContextType = {
  routeNode: RouteNode;
  linking: ExpoLinkingOptions;
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
  initialState: ResultState | undefined;
};

export const ExpoRouterContext = React.createContext<ExpoRouteContextType>({
  routeNode: {
    loadRoute: () => ({ default: () => null }),
    children: [],
    dynamic: null,
    route: "",
    contextKey: "",
  },
  initialState: undefined,
  linking: { prefixes: [] },
  navigationRef:
    {} as NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
});

export function useRootNavigation() {
  return useNavigationContainerRef();
}

export function useLinkingContext() {
  return React.useContext(ExpoRouterContext).linking;
}

export function useRootNavigationState() {
  const { initialState, navigationRef } = React.useContext(ExpoRouterContext);
  return navigationRef.current?.getRootState() ?? initialState;
}

export function useRouteInfo() {
  const { linking, initialState } = React.useContext(ExpoRouterContext);
  const navigation = useNavigation();
  const state = navigation.getState() ?? initialState;

  return React.useMemo(() => {
    if (!linking) {
      throw new Error("No screens in the linking config found.");
    }
    if (!state) {
      // This should never occur, as the root state is always set.
      return {
        pathname: "",
        params: {},
        segments: [],
      };
    }
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
  }, [state, linking]);
}

export function useSegments() {
  return useRouteInfo()?.segments;
}

export function usePathname() {
  return useRouteInfo()?.pathname;
}

export function useSearchParams() {
  return useRouteInfo()?.params;
}

export function useLocalSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return (useRoute()?.params ?? ({} as any)) as Partial<TParams>;
}
