import React, { createContext, useContext } from "react";

import { State } from "./fork/getPathFromState";
import { useInitialRootState } from "./useInitialRootState";

export const InitialRootStateContext = createContext<State | null>(null);

if (process.env.NODE_ENV !== "production") {
  InitialRootStateContext.displayName = "InitialRootStateContext";
}

/** Fetch the initial root navigation state instantly on web and slightly delayed on native. */
export function useInitialRootStateContext() {
  const state = useContext(InitialRootStateContext);
  if (!state) {
    throw new Error(
      "useInitialRootStateContext is being used outside of InitialRootStateContext.Provider"
    );
  }
  return state;
}

/**
 * Unlike React Navigation, we statically know the config and always assume a URL is available.
 * This enables us to always know the root state.
 */
export function InitialRootStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useInitialRootState();

  // TODO: This is only used on native but it shouldn't be used at all.
  if (!state) {
    // Prevent all rendering until we have the initial root state.
    // Probably React Navigation should be doing this for us.
    return null;
  }

  return (
    <InitialRootStateContext.Provider value={state}>
      {children}
    </InitialRootStateContext.Provider>
  );
}
