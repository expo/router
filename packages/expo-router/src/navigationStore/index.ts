import {
  LinkingOptions,
  NavigationState,
  ParamListBase,
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
import { getInitialState } from "./initialState";

export const navigationRef =
  createNavigationContainerRef<Record<string, unknown>>();

type SearchParams = Record<string, string | string[]>;

type UrlObject = {
  pathname: string;
  readonly params: SearchParams;
  segments: string[];
};

export class NavigationStore {
  subscriptionMap = new Map<string, Set<() => void>>([
    ["rootState", new Set()],
    ["routeInfo", new Set()],
    ["url", new Set()],
  ]);

  ssrLocation: URL | undefined;

  navigationRef = navigationRef;
  routeNode!: RouteNode;
  linking!: LinkingOptions<object>;
  rootState: NavigationState | PartialState<NavigationState> | undefined;
  initialRootState: ResultState | undefined;
  url!: URL;
  routeInfo!: UrlObject;

  shouldShowTutorial = false;
  _onReady?: () => void;

  constructor(ssrLocation?: URL) {
    this.ssrLocation = ssrLocation;
  }

  initialise = (context: RequireContext, onReady: () => void) => {
    this._onReady = onReady;
    this.routeNode = getRoutes(context)!;

    this.linking = getLinkingConfig(this.routeNode);
    this.initialRootState = getInitialState(this.linking, this.ssrLocation);

    this.handleRouteInfoChange(this.initialRootState);

    if (process.env.NODE_ENV === "development") {
      if (process.env.EXPO_ROUTER_IMPORT_MODE === "sync") {
        this.shouldShowTutorial = !context.keys().some((key) => {
          // NOTE(EvanBacon): This should only ever occur in development as it breaks lazily loading.
          const component = context(key)?.default;
          return typeof component === "function";
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
      (this.rootState ?? this.initialRootState)!
    );

    if (!this.routeInfo) {
      this.routeInfo = newRouteInfo;
    } else if (!compareRouteInfo(this.routeInfo, newRouteInfo)) {
      this.routeInfo = newRouteInfo;
    }

    if (this.routeInfo === newRouteInfo) {
      this.notifiySubscribers("routeInfo");
    }
  };

  onReady = () => {
    navigationRef.addListener("state", ({ data }) => {
      this.rootState = data.state;

      this.notifiySubscribers("rootState");

      this.handleRouteInfoChange(data.state);
    });

    this.rootState = navigationRef.getRootState();
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
      return () => {
        this.subscriptionMap.get(key)?.delete(callback);
      };
    };
  };

  subscribeRouteInfo = this.subscribeFactory("routeInfo");
  subscribeRootState = this.subscribeFactory("rootState");
}

export const NavigationStoreContext = React.createContext(
  new NavigationStore()
);

export function useNavigationStore(context: RequireContext) {
  const navigationStore = React.useContext(NavigationStoreContext);
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

export function useRootNavigation() {
  return navigationRef;
}

export function useLinkingContext() {
  const navigationStore = React.useContext(NavigationStoreContext);
  const [, update] = React.useReducer((acc) => acc + 1, 0);

  React.useEffect(() => navigationStore.subscribeRootState(update), []);

  return navigationStore.linking as Required<
    Omit<LinkingOptions<ParamListBase>, "filter" | "enabled">
  > & {
    getPathFromState: typeof getPathFromState;
  };
}

export function useRootNavigationState() {
  const navigationStore = React.useContext(NavigationStoreContext);
  const [, update] = React.useReducer((acc) => acc + 1, 0);

  React.useEffect(() => navigationStore.subscribeRootState(update), []);

  return navigationStore.rootState;
}

export function useRouteInfo() {
  const navigationStore = React.useContext(NavigationStoreContext);
  const [, update] = React.useReducer((acc) => acc + 1, 0);

  React.useEffect(() => navigationStore.subscribeRouteInfo(update), []);

  return navigationStore.routeInfo;
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
