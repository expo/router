import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import React from "react";

import { State } from "./fork/getPathFromState";

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

export function useRootNavigationState(): State | undefined {
  const navigation = useRootNavigation();
  const [state, setPath] = React.useState(navigation?.getRootState());
  React.useEffect(() => {
    if (navigation) {
      setPath(navigation.getRootState());
      const unsubscribe = navigation.addListener("state", ({ data }) => {
        setPath(
          // @ts-expect-error: idk
          data.state
        );
      });
      return unsubscribe;
    }
    return undefined;
  }, [navigation]);

  return state;
}
