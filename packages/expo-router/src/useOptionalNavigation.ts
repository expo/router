import {
  NavigationContainerRefContext,
  NavigationContext,
  NavigationProp,
} from "@react-navigation/native";
import * as React from "react";

/**
 * Hook to access the navigation prop of the parent screen anywhere.
 *
 * @returns Navigation prop of the parent screen.
 */
export function useOptionalNavigation<
  T = NavigationProp<ReactNavigation.RootParamList>
>(): T | null {
  const root = React.useContext(NavigationContainerRefContext);
  const navigation = React.useContext(NavigationContext);

  // FIXME: Figure out a better way to do this
  return (navigation ?? root ?? null) as unknown as T | null;
}
