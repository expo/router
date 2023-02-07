import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { Platform, Dimensions } from "react-native";
import { ContextNavigator } from "../ContextNavigator";
import Head from "../head/Head";
import { RequireContext } from "../types";

function getGestureHandlerRootView() {
  try {
    const { GestureHandlerRootView } =
      require("react-native-gesture-handler") as typeof import("react-native-gesture-handler");

    return function GestureHandler(props: any) {
      return <GestureHandlerRootView style={{ flex: 1 }} {...props} />;
    };
  } catch {
    return React.Fragment;
  }
}

const GestureHandlerRootView = getGestureHandlerRootView();

// We add this elsewhere for rendering
const EnsureHelmetProvider =
  typeof window === "undefined" ? React.Fragment : Head.Provider;

const { width = 0, height = 0 } = Dimensions.get("window");

// To support SSR on web, we need to have empty insets for initial values
// Otherwise there can be mismatch between SSR and client output
// We also need to specify empty values to support test environments
const INITIAL_METRICS =
  Platform.OS === "web" || initialWindowMetrics == null
    ? {
        frame: { x: 0, y: 0, width, height },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }
    : initialWindowMetrics;

export function ExpoRoot({ context }: { context: RequireContext }) {
  return (
    <GestureHandlerRootView>
      <EnsureHelmetProvider>
        <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
          <ContextNavigator context={context} />
          {/* Users can override this by adding another StatusBar element anywhere higher in the component tree. */}
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </EnsureHelmetProvider>
    </GestureHandlerRootView>
  );
}
