import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import React from "react";

export const RootNavigationRef = React.createContext<{
  ref: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> | null;
}>({ ref: null });

if (process.env.NODE_ENV !== "production") {
  RootNavigationRef.displayName = "RootNavigationRef";
}

export function useRootNavigation() {
  const context = React.useContext(RootNavigationRef);
  if (!context) {
    throw new Error(
      "useRootNavigation must be used within a NavigationContainerContext"
    );
  }
  return context.ref;
}

export function useCurrentRoute() {
  const root = useRootNavigation();
  let path = root?.getCurrentRoute()?.path;
  if (path === undefined) return null;

  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  return path;
}
