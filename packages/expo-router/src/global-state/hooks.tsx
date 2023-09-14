import { useNavigationContainerRef } from "@react-navigation/native";
import { useSyncExternalStore, useEffect } from "react";

import { ResultState } from "../fork/getStateFromPath";
import { RequireContext } from "../types";
import { store } from "./router-store";

export function useExpoRouter() {
  return useSyncExternalStore(
    store.subscribeToStore,
    store.snapshot,
    store.snapshot
  );
}

function syncStoreRootState() {
  if (store.navigationRef.isReady()) {
    const currentState =
      store.navigationRef.getRootState() as unknown as ResultState;

    if (store.rootState !== currentState) {
      store.updateState(currentState);
    }
  }
}

export function useStoreRootState() {
  syncStoreRootState();
  return useSyncExternalStore(
    store.subscribeToRootState,
    store.rootStateSnapshot,
    store.rootStateSnapshot
  );
}

export function useStoreRouteInfo() {
  syncStoreRootState();
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

  useEffect(
    () => store.initialize(context, navigationRef, initialLocation),
    [context, initialLocation]
  );

  useExpoRouter();
  return store;
}
