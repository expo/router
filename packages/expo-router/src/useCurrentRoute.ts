import React from "react";

export const VirtualRouteContext = React.createContext<{
  pathname: string | null;
  query: Record<string, any>;
}>({ pathname: null, query: {} });

if (process.env.NODE_ENV !== "production") {
  VirtualRouteContext.displayName = "VirtualRouteContext";
}

export function useCurrentRoute() {
  const context = React.useContext(VirtualRouteContext);
  if (!context) {
    throw new Error(
      "useCurrentRoute must be used within a NavigationContainerContext"
    );
  }
  return context;
}
