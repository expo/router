import { createContext, useContext } from "react";

import { RouteNode } from "./Route";

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
