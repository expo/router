import { createContext, useContext } from "react";

import { Node } from "./getRoutes";

// Routes context
export const RoutesContext = createContext<Node[]>([]);

export function useRoutesContext() {
  const routes = useContext(RoutesContext);
  if (!routes) {
    throw new Error(
      "useRoutes is being used outside of RoutesContext.Provider"
    );
  }
  return routes;
}
