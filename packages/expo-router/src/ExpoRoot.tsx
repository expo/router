import { useNavigationContainerRef } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import UpstreamNavigationContainer from "./fork/NavigationContainer";
import { ResultState } from "./fork/getStateFromPath";
import {
  ExpoRouterContext,
  RootStateContext,
  RootStateContextType,
} from "./hooks";
import {
  ExpoRootProps,
  useCreateExpoRouterContext,
} from "./useCreateExpoRouterContext";
import { getQualifiedRouteComponent } from "./useScreens";
import { SplashScreen } from "./views/Splash";

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

function ContextNavigator(props: ExpoRootProps) {
  const navigationRef = useNavigationContainerRef();
  const [shouldShowSplash, setShowSplash] = React.useState(
    Platform.OS !== "web"
  );

  const expoContext = useCreateExpoRouterContext(props);

  const { routeNode, initialState, linking, getRouteInfo } = expoContext;

  const [rootState, setRootState] = React.useState<RootStateContextType>(() => {
    if (initialState) {
      return {
        state: initialState,
        routeInfo: getRouteInfo(initialState),
      };
    } else {
      return {
        routeInfo: {
          unstable_globalHref: "",
          pathname: "",
          params: {},
          segments: [],
        },
      };
    }
  });

  React.useEffect(() => {
    const subscription = navigationRef.addListener("state", (data) => {
      const state = data.data.state as ResultState;
      setRootState({
        state,
        routeInfo: getRouteInfo(state),
      });
    });

    return () => subscription?.();
  }, [navigationRef, getRouteInfo]);

  const Component = routeNode ? getQualifiedRouteComponent(routeNode) : null;

  const comp = React.useMemo(() => {
    if (!Component) {
      return null;
    }
    return <Component />;
  }, [Component, shouldShowSplash]);

  if (!routeNode) {
    if (process.env.NODE_ENV === "development") {
      const Tutorial = require("./onboard/Tutorial").Tutorial;
      SplashScreen.hideAsync();
      return <Tutorial />;
    } else {
      throw new Error("No routes found");
    }
  }

  return (
    <>
      {shouldShowSplash && <SplashScreen />}
      <ExpoRouterContext.Provider value={{ ...expoContext, navigationRef }}>
        <UpstreamNavigationContainer
          ref={navigationRef}
          initialState={initialState}
          linking={linking}
          onReady={() => requestAnimationFrame(() => setShowSplash(false))}
        >
          <RootStateContext.Provider value={rootState}>
            {!shouldShowSplash && comp}
          </RootStateContext.Provider>
        </UpstreamNavigationContainer>
      </ExpoRouterContext.Provider>
    </>
  );
}
