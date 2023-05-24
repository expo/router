import {
  NavigationContainerRefWithCurrent,
  getPathFromState,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { useSyncExternalStore, useMemo } from "react";

import { UrlObject, getRouteInfoFromState } from "../LocationProvider";
import { RouteNode } from "../Route";
import { getPathDataFromState } from "../fork/getPathFromState";
import { ResultState } from "../fork/getStateFromPath";
import { ExpoLinkingOptions, getLinkingConfig } from "../getLinkingConfig";
import { getRoutes } from "../getRoutes";
import { RequireContext } from "../types";
import { getQualifiedRouteComponent } from "../useScreens";
import { goBack, linkTo, push, replace, setParams } from "./routing";
import { getSortedRoutes } from "./sort-routes";

/**
 * This is the global state for the router. It is used to keep track of the current route, and to provide a way to navigate to other routes.
 *
 * There should only be one instance of this class and be initialized via `useInitializeExpoRouter`
 */
export class RouterStore {
  routeNode!: RouteNode | null;
  linking: ExpoLinkingOptions | undefined;
  isReady: boolean = false;

  initialState: ResultState | undefined;
  rootState: ResultState | undefined;
  routeInfo?: UrlObject | undefined;

  navigationRef!: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
  navigationRefSubscription!: () => void;

  rootStateSubscribers = new Set<() => void>();
  storeSubscribers = new Set<() => void>();

  linkTo = linkTo.bind(this);
  getSortedRoutes = getSortedRoutes.bind(this);
  goBack = goBack.bind(this);
  push = push.bind(this);
  replace = replace.bind(this);
  setParams = setParams.bind(this);

  initialize(
    context: RequireContext,
    navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
    initialLocation?: URL
  ) {
    // Clean up any previous listeners.
    this.isReady = false;
    this.initialState = undefined;
    this.rootState = undefined;
    this.routeInfo = undefined;
    this.linking = undefined;
    this.navigationRefSubscription?.();
    this.rootStateSubscribers.clear();
    this.storeSubscribers.clear();

    this.routeNode = getRoutes(context);

    // Only error in production, in development we will show the onboarding screen
    if (!this.routeNode && process.env.NODE_ENV === "production") {
      throw new Error("No routes found");
    }

    this.navigationRef = navigationRef;

    if (this.routeNode) {
      this.linking = getLinkingConfig(this.routeNode!);

      if (initialLocation) {
        this.initialState = this.linking.getStateFromPath?.(
          initialLocation.pathname + initialLocation.search,
          this.linking.config
        );
      }
    }

    // There is no routeNode, so we will be showing the onboarding screen
    // In the meantime, just mock the routeInfo
    if (this.initialState) {
      this.rootState = this.initialState;
      this.routeInfo = this.getRouteInfo(this.initialState);
    } else {
      this.routeInfo = {
        unstable_globalHref: "",
        pathname: "",
        params: {},
        segments: [],
      };
    }

    this.navigationRefSubscription = navigationRef.addListener(
      "state",
      (data) => {
        const state = data.data.state as ResultState;

        if (navigationRef.isReady()) {
          this.onReady();
        }

        if (state !== this.rootState) {
          this.rootState = state;
          this.routeInfo = this.getRouteInfo(state);

          for (const subscriber of this.rootStateSubscribers) {
            subscriber();
          }
        }
      }
    );
  }

  getRouteInfo(state: ResultState) {
    return getRouteInfoFromState(
      (state: Parameters<typeof getPathFromState>[0], asPath: boolean) => {
        return getPathDataFromState(state, {
          screens: [],
          ...this.linking?.config,
          preserveDynamicRoutes: asPath,
          preserveGroups: asPath,
        });
      },
      state
    );
  }

  // This is only used in development, to show the onboarding screen
  // In production we should have errored during the initialization
  shouldShowTutorial() {
    return !this.routeNode && process.env.NODE_ENV === "development";
  }

  getQualifiedRouteComponent() {
    if (!this.routeNode) {
      // This will never throw, as either the onboarding screen will be shown or it will have errored during initialization
      throw new Error("No routes found");
    }
    return getQualifiedRouteComponent(this.routeNode);
  }

  /** Make sure these are arrow functions so `this` is correctly bound */
  onReady = () => {
    this.isReady = true;
  };
  subscribeToRootState = (subscriber: () => void) => {
    this.rootStateSubscribers.add(subscriber);
    return () => this.rootStateSubscribers.delete(subscriber);
  };
  subscribeToStore = (subscriber: () => void) => {
    this.storeSubscribers.add(subscriber);
    return () => this.storeSubscribers.delete(subscriber);
  };
  snapshot = () => {
    return this;
  };
  rootStateSnapshot = () => {
    return this.rootState!;
  };
  routeInfoSnapshot = () => {
    return this.routeInfo!;
  };
}

export const store = new RouterStore();

export function useExpoRouter() {
  return useSyncExternalStore(
    store.subscribeToStore,
    store.snapshot,
    store.snapshot
  );
}

export function useStoreRootState() {
  return useSyncExternalStore(
    store.subscribeToRootState,
    store.rootStateSnapshot,
    store.rootStateSnapshot
  );
}

export function useStoreRouteInfo() {
  return useSyncExternalStore(
    store.subscribeToRootState,
    store.routeInfoSnapshot,
    store.routeInfoSnapshot
  );
}

export function useInitializeExpoRouter(
  context: RequireContext,
  initialLocation: URL | undefined
) {
  const navigationRef = useNavigationContainerRef();
  useMemo(
    () => store.initialize(context, navigationRef, initialLocation),
    [context, initialLocation]
  );
  useExpoRouter();
  return store;
}
