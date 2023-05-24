import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import UpstreamNavigationContainer from "./fork/NavigationContainer";
import { useInitializeExpoRouter } from "./global-state/router-store";
import { RequireContext } from "./types";
import { SplashScreen } from "./views/Splash";

export type ExpoRootProps = {
  context: RequireContext;
  location?: URL;
};

function getGestureHandlerRootView() {
  try {
    const { GestureHandlerRootView } =
      require("react-native-gesture-handler") as typeof import("react-native-gesture-handler");

    // eslint-disable-next-line no-inner-declarations
    function GestureHandler(props: any) {
      return <GestureHandlerRootView style={{ flex: 1 }} {...props} />;
    }
    if (process.env.NODE_ENV === "development") {
      // @ts-expect-error
      GestureHandler.displayName = "GestureHandlerRootView";
    }
    return GestureHandler;
  } catch {
    return React.Fragment;
  }
}

const GestureHandlerRootView = getGestureHandlerRootView();

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export function ExpoRoot({ context, location }: ExpoRootProps) {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider
        // SSR support
        initialMetrics={INITIAL_METRICS}
      >
        <ContextNavigator context={context} location={location} />
        {/* Users can override this by adding another StatusBar element anywhere higher in the component tree. */}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const initialUrl =
  Platform.OS === "web" && typeof window !== "undefined"
    ? new URL(window.location.href)
    : undefined;

function ContextNavigator({
  context,
  location: initialLocation = initialUrl,
}: ExpoRootProps) {
  const store = useInitializeExpoRouter(context, initialLocation);
  const [isReady, setIsReady] = useState(store.isReady);
  const [shouldShowSplash, setShowSplash] = React.useState(
    Platform.OS !== "web"
  );

  if (store.shouldShowTutorial()) {
    const Tutorial = require("./onboard/Tutorial").Tutorial;
    SplashScreen.hideAsync();
    return <Tutorial />;
  }

  const Component = store.getQualifiedRouteComponent();

  return (
    <>
      {shouldShowSplash && <SplashScreen />}
      <UpstreamNavigationContainer
        ref={store.navigationRef}
        initialState={store.initialState}
        linking={store.linking}
        onReady={() => {
          store.onReady();
          setIsReady(true);
          requestAnimationFrame(() => setShowSplash(false));
        }}
      >
        {isReady && <Component />}
      </UpstreamNavigationContainer>
    </>
  );
}
