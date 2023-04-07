import {
  LinkingOptions,
  NavigationState,
  PartialState,
  createNavigationContainerRef,
  useRoute,
} from "@react-navigation/native";
import React from "react";

import { compareRouteInfo, getRouteInfoFromState } from "../LocationProvider";
import { RouteNode } from "../Route";
import getPathFromState, {
  getPathDataFromState,
} from "../fork/getPathFromState";
import { ResultState } from "../fork/getStateFromPath";
import { getLinkingConfig } from "../getLinkingConfig";
import { getRoutes } from "../getRoutes";
import { RequireContext } from "../types";

const navigation = createNavigationContainerRef<Record<string, unknown>>();

type SearchParams = Record<string, string | string[]>;

type UrlObject = {
  pathname: string;
  readonly params: SearchParams;
  segments: string[];
};

class NavigationStore {
  subscriptionMap = new Map<string, Set<() => void>>([
    ["rootState", new Set()],
    ["url", new Set()],
  ]);

  navigation = navigation;
  routeNode!: RouteNode;
  linking!: LinkingOptions<object>;
  rootState: NavigationState | PartialState<NavigationState> | undefined;
  initialRootState: ResultState | undefined;
  url!: URL;
  routeInfo!: UrlObject;

  shouldShowTutorial = false;
  _onReady?: () => void;

  initialise = (context: RequireContext, onReady: () => void) => {
    this._onReady = onReady;
    this.routeNode = getRoutes(context)!;

    const linking = getLinkingConfig(this.routeNode);
    this.linking = linking;

    this.initialRootState = this.linking.getStateFromPath?.(
      window.location.pathname,
      this.linking.config
    );

    this.handleRouteInfoChange(this.initialRootState);

    if (process.env.NODE_ENV === "development") {
      if (process.env.EXPO_ROUTER_IMPORT_MODE === "sync") {
        this.shouldShowTutorial = !context.keys().some((key) => {
          // NOTE(EvanBacon): This should only ever occur in development as it breaks lazily loading.
          const component = context(key)?.default;
          return React.isValidElement(component);
        });
      } else {
        this.shouldShowTutorial = context.keys().length === 0;
      }
    }
  };

  handleRouteInfoChange = (
    data?: NavigationState | PartialState<NavigationState>
  ) => {
    if (!data) return;

    const getPathDataFromStateWithLinking = (
      state: Parameters<typeof getPathFromState>[0],
      asPath: boolean
    ) => {
      return getPathDataFromState(state, {
        ...this.linking.config!,
        preserveDynamicRoutes: asPath,
        preserveGroups: asPath,
      });
    };

    const newRouteInfo = getRouteInfoFromState(
      getPathDataFromStateWithLinking,
      this.initialRootState!
    );

    if (!this.routeInfo) {
      this.routeInfo = newRouteInfo;
    } else if (!compareRouteInfo(this.routeInfo, newRouteInfo)) {
      this.routeInfo = newRouteInfo;
    }

    if (this.routeInfo !== newRouteInfo) {
      this.notifiySubscribers("routeInfo");
    }
  };

  onReady = () => {
    navigation.addListener("state", ({ data }) => {
      this.rootState = data.state;
      this.notifiySubscribers("rootState");
      this.handleRouteInfoChange(data.state);
    });

    this.rootState = navigation.getRootState();
    this._onReady?.();
  };

  notifiySubscribers = (topic: string) => {
    for (const subscriber of this.subscriptionMap.get(topic) ?? []) {
      subscriber();
    }
  };

  subscribeFactory = (key: string) => {
    return (callback: () => void) => {
      this.subscriptionMap.get(key)?.add(callback);
      return () => this.subscriptionMap.get(key)?.delete(callback);
    };
  };

  subscribeRouteInfo = this.subscribeFactory("routeInfo");
  getRouteInfo = () => this.routeInfo;
}

const navigationStore = new NavigationStore();

export function useNavigationStore(context: RequireContext) {
  const [shouldShowSplash, setShowSplash] = React.useState(true);

  React.useMemo(
    () =>
      navigationStore.initialise!(context, () => {
        requestAnimationFrame(() => {
          setShowSplash(false);
        });
      }),
    [context]
  );

  return Object.assign(navigationStore, { shouldShowSplash });
}

export function useRouteInfo() {
  return React.useSyncExternalStore(
    navigationStore.subscribeRouteInfo,
    navigationStore.getRouteInfo,
    navigationStore.getRouteInfo
  );
}

export function useSegments() {
  return useRouteInfo().segments;
}

export function usePathname() {
  return useRouteInfo().pathname;
}

export function useSearchParams() {
  return useRouteInfo().params;
}

export function useLocalSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return (useRoute()?.params ?? ({} as any)) as Partial<TParams>;
}
