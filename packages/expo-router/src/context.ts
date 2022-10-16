import { createContext, useContext } from "react";

import { RouteNode } from "./Route";

// Routes context
export const RoutesContext = createContext<RouteNode | null>(null);

if (process.env.NODE_ENV !== "production") {
  RoutesContext.displayName = "RoutesContext";
}

export function useRoutesContext() {
  const routes = useContext(RoutesContext);
  if (!routes) {
    throw new Error(
      "useRoutes is being used outside of RoutesContext.Provider"
    );
  }
  return routes;
}
