import { createNavigationContainerRef } from "@react-navigation/native";
import React from "react";

import UpstreamNavigationContainer from "./fork/NavigationContainer";
import { getLinkingConfig } from "./getLinkingConfig";
import { RootNavigationRef } from "./useRootNavigation";
import { useRootRouteNodeContext } from "./useRootRouteNodeContext";
import { SplashScreen } from "./views/Splash";

const navigationRef = createNavigationContainerRef<Record<string, unknown>>();

/** Get the root navigation container ref. */
export function getNavigationContainerRef() {
  return navigationRef;
}

/** react-navigation `NavigationContainer` with automatic `linking` prop generated from the routes context. */
export function NavigationContainer(props: { children: React.ReactNode }) {
  const [isReady, setReady] = React.useState(false);
  const [isSplashReady, setSplashReady] = React.useState(false);
  const ref = React.useMemo(() => (isReady ? navigationRef : null), [isReady]);
  const root = useRootRouteNodeContext();
  const linking = React.useMemo(() => getLinkingConfig(root), [root]);

  return (
    <RootNavigationRef.Provider value={{ ref }}>
      {!isSplashReady && <SplashScreen />}
      <UpstreamNavigationContainer
        {...props}
        linking={linking}
        ref={navigationRef}
        onReady={() => {
          setReady(true);
          // Allow one cycle for the children to mount a splash screen
          // that will prevent the splash screen from hiding.
          requestAnimationFrame(() => {
            setSplashReady(true);
          });
        }}
      />
    </RootNavigationRef.Provider>
  );
}
