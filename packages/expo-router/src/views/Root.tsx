import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ContextNavigator } from "../ContextNavigator";
import { Head } from "../head/Head";
import { RequireContext } from "../types";

function getGestureHandlerRootView() {
  try {
    const { GestureHandlerRootView } =
      require("react-native-gesture-handler") as typeof import("react-native-gesture-handler");

    return function GestureHandler(props: any) {
      return (
        <GestureHandlerRootView
          testID="gesture-handler-root-view"
          style={{ flex: 1 }}
          {...props}
        />
      );
    };
  } catch {
    return React.Fragment;
  }
}

const GestureHandlerRootView = getGestureHandlerRootView();

// We add this elsewhere for rendering
const EnsureHelmetProvider =
  typeof window === "undefined" ? React.Fragment : Head.Provider;

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export function ExpoRoot({ context }: { context: RequireContext }) {
  return (
    <GestureHandlerRootView>
      <EnsureHelmetProvider>
        <SafeAreaProvider
          // SSR support
          initialMetrics={INITIAL_METRICS}
        >
          <ContextNavigator context={context} />
          {/* Users can override this by adding another StatusBar element anywhere higher in the component tree. */}
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </EnsureHelmetProvider>
    </GestureHandlerRootView>
  );
}
