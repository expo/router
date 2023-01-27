import React, { createContext, useContext, useEffect, useState } from "react";
import URL from "url-parse";

import { State } from "./fork/getPathFromState";
import { useLinkingContext } from "./link/useLinkingContext";
import { useServerState } from "./useServerState";

function useResolvedPromise<T>(promise: Promise<T> | undefined) {
  const [resolved, setResolved] = useState<T | undefined>();

  useEffect(() => {
    if (promise) {
      promise.then(setResolved);
    }
  }, [promise]);

  return resolved;
}

function useHackInitialRootState() {
  // TODO: We probably don't need this
  const serverState = useServerState();

  const linking = useLinkingContext();
  const url = useResolvedPromise(linking.getInitialURL() as Promise<string>);
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    if (url) {
      const parsed = URL(url);
      // TODO: Add hashes to the path
      const urlWithoutOrigin = parsed.pathname + parsed.query;

      setState(linking.getStateFromPath(urlWithoutOrigin, linking.config)!);
    }
  }, [url, linking]);

  return state ?? serverState;
}

export const InitialRootStateContext = createContext<State | null>(null);

if (process.env.NODE_ENV !== "production") {
  InitialRootStateContext.displayName = "InitialRootStateContext";
}

export function useInitialRootStateContext() {
  const state = useContext(InitialRootStateContext);
  if (!state) {
    throw new Error(
      "useInitialRootStateContext is being used outside of InitialRootStateContext.Provider"
    );
  }
  return state;
}

export function InitialRootStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useHackInitialRootState();

  // Prevent all rendering until we have the initial root state.
  // Probably React Navigation should be doing this for us.
  if (!state) {
    return null;
  }

  return (
    <InitialRootStateContext.Provider value={state}>
      {children}
    </InitialRootStateContext.Provider>
  );
}
