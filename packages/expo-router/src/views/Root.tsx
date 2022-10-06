import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ContextNavigator } from "../ContextNavigator";
import { RequireContext } from "../types";

function getGestureHandlerRootView() {
  try {
    return require("react-native-gesture-handler")
      .GestureHandlerRootView as typeof import("react-native-gesture-handler").GestureHandlerRootView;
  } catch {
    return React.Fragment;
  }
}

const GestureHandlerRootView = getGestureHandlerRootView();

export function ExpoRoot({ context }: { context: RequireContext }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ContextNavigator context={context} />
        {/* Users can override this by adding another StatusBar element anywhere higher in the component tree. */}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
