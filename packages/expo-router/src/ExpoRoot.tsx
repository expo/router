import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import UpstreamNavigationContainer from "./fork/NavigationContainer";
import { useNavigationStore } from "./navigationStore";
import { RequireContext } from "./types";
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
    <Head.Provider>
      <GestureHandlerRootView>
        <SafeAreaProvider
          testID="test"
          // SSR support
          initialMetrics={INITIAL_METRICS}
        >
          <ContextNavigator context={context} />
          {/* Users can override this by adding another StatusBar element anywhere higher in the component tree. */}
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Head.Provider>
  );
}

function ContextNavigator({ context }: { context: RequireContext }) {
  const {
    shouldShowTutorial,
    shouldShowSplash,
    linking,
    navigationRef,
    onReady,
    routeNode,
  } = useNavigationStore(context);

  if (shouldShowTutorial) {
    const Tutorial = require("./onboard/Tutorial").Tutorial;
    SplashScreen.hideAsync();
    return <Tutorial />;
  }

  const Component = getQualifiedRouteComponent(routeNode);

  return (
    <>
      {shouldShowSplash && <SplashScreen />}
      <UpstreamNavigationContainer
        linking={linking}
        ref={navigationRef}
        onReady={onReady}
      >
        <Component />
      </UpstreamNavigationContainer>
    </>
  );
}
