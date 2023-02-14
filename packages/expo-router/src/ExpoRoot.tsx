import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer } from "./NavigationContainer";
import { useTutorial } from "./onboard/useTutorial";
import { RequireContext } from "./types";
import { InitialRootStateProvider } from "./useInitialRootStateContext";
import {
  RootRouteNodeProvider,
  useRootRouteNodeContext,
} from "./useRootRouteNodeContext";
import { getQualifiedRouteComponent } from "./useScreens";
import { SplashScreen } from "./views/Splash";

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

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export function ExpoRoot({ context }: { context: RequireContext }) {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider
        // SSR support
        initialMetrics={INITIAL_METRICS}
      >
        <ContextNavigator context={context} />
        {/* Users can override this by adding another StatusBar element anywhere higher in the component tree. */}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ContextNavigator({ context }: { context: RequireContext }) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const Tutorial = useTutorial(context);
    if (Tutorial) {
      SplashScreen.hideAsync();
      return <Tutorial />;
    }
  }

  return (
    <RootRouteNodeProvider context={context}>
      <NavigationContainer>
        <InitialRootStateProvider>
          <RootRoute />
        </InitialRootStateProvider>
      </NavigationContainer>
    </RootRouteNodeProvider>
  );
}

function RootRoute() {
  const Component = getQualifiedRouteComponent(useRootRouteNodeContext());
  return <Component />;
}
