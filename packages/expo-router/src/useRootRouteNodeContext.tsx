import React, { createContext, useContext, useMemo } from "react";

import { RouteNode } from "./Route";
import { getRoutes } from "./getRoutes";
import { RequireContext } from "./types";

// Routes context
export const RootRouteNodeContext = createContext<RouteNode | null>(null);

if (process.env.NODE_ENV !== "production") {
  RootRouteNodeContext.displayName = "RoutesContext";
}

export function useRootRouteNodeContext() {
  const routes = useContext(RootRouteNodeContext);
  if (!routes) {
    throw new Error(
      "useRootRouteNodeContext is being used outside of RootRouteNodeContext.Provider"
    );
  }
  return routes;
}

/** Provide the require context as normalized routes. */
export function RootRouteNodeProvider({
  context,
  children,
}: {
  context: RequireContext;
  children: React.ReactNode;
}) {
  // TODO: Is this an optimal hook dependency?
  const keys = useMemo(() => context.keys(), [context]);
  const routes = useMemo(() => getRoutes(context), [keys]);
  return (
    <RootRouteNodeContext.Provider value={routes}>
      {children}
    </RootRouteNodeContext.Provider>
  );
}
