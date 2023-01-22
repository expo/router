import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ContextNavigator } from "../ContextNavigator";
import { RequireContext } from "../types";

function getGestureHandlerRootView() {
  try {
    const { GestureHandlerRootView } =
      require("react-native-gesture-handler") as typeof import("react-native-gesture-handler");

    return function GestureHandler(props: any) {
      return <GestureHandlerRootView testID="gesture-handler-root-view" style={{ flex: 1 }} {...props} />;
    };
  } catch {
    return React.Fragment;
  }
}

const GestureHandlerRootView = getGestureHandlerRootView();

export function ExpoRoot({ context }: { context: RequireContext }) {
  return (
    <GestureHandlerRootView>
      
        <ContextNavigator context={context} />
        {/* Users can override this by adding another StatusBar element anywhere higher in the component tree. */}
        <StatusBar style="auto" />
      
    </GestureHandlerRootView>
  );
}
