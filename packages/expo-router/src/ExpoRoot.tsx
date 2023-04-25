import { useNavigationContainerRef } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import UpstreamNavigationContainer from "./fork/NavigationContainer";
import { ResultState } from "./fork/getStateFromPath";
import { getLinkingConfig } from "./getLinkingConfig";
import { getRoutes } from "./getRoutes";
import { ExpoRouterContext } from "./hooks";
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

export type ExpoRootProps = {
  context: RequireContext;
  location?: URL;
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

function ContextNavigator({
  context,
  location = Platform.OS === "web" ? new URL(window.location.href) : undefined,
}: ExpoRootProps) {
  const navigationRef = useNavigationContainerRef();
  const [shouldShowSplash, setShowSplash] = React.useState(
    Platform.OS !== "web"
  );

  const expoContext = React.useMemo(() => {
    const routeNode = getRoutes(context);
    const linking = getLinkingConfig(routeNode!);
    let initialState: ResultState | undefined;

    if (location) {
      initialState = linking.getStateFromPath?.(
        location.pathname + location.search,
        linking.config
      );
    }

    return {
      routeNode,
      linking,
      navigationRef,
      initialState,
    };
  }, [context, navigationRef, location]);

  const { routeNode, initialState, linking } = expoContext;

  if (!routeNode) {
    if (process.env.NODE_ENV === "development") {
      const Tutorial = require("./onboard/Tutorial").Tutorial;
      SplashScreen.hideAsync();
      return <Tutorial />;
    } else {
      throw new Error("No routes found");
    }
  }

  const Component = getQualifiedRouteComponent(routeNode);

  return (
    <>
      {shouldShowSplash && <SplashScreen />}
      <ExpoRouterContext.Provider value={expoContext}>
        <UpstreamNavigationContainer
          ref={navigationRef}
          initialState={initialState}
          linking={linking}
          onReady={() => {
            requestAnimationFrame(() => setShowSplash(false));
          }}
        >
          {!shouldShowSplash && <Component />}
        </UpstreamNavigationContainer>
      </ExpoRouterContext.Provider>
    </>
  );
}
