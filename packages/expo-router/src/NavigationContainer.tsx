import {
  createNavigationContainerRef,
  NavigationContainer as UpstreamNavigationContainer,
} from "@react-navigation/native";
import React from "react";

import { getLinkingConfig } from "./getLinkingConfig";
import { RootNavigationRef } from "./useRootNavigation";
import { useRootRouteNodeContext } from "./useRootRouteNodeContext";
import { SplashScreen } from "./views/Splash";

type NavigationContainerProps = React.ComponentProps<
  typeof UpstreamNavigationContainer
>;

const navigationRef = createNavigationContainerRef();

/** Get the root navigation container ref. */
export function getNavigationContainerRef() {
  return navigationRef;
}

/** react-navigation `NavigationContainer` with automatic `linking` prop generated from the routes context. */
export function NavigationContainer(props: NavigationContainerProps) {
  const [isReady, setReady] = React.useState(false);
  const [isSplashReady, setSplashReady] = React.useState(false);
  const ref = React.useMemo(() => (isReady ? navigationRef : null), [isReady]);
  const root = useRootRouteNodeContext();
  const linking = React.useMemo(() => getLinkingConfig(root), [root]);

  React.useEffect(() => {
    props.onReady?.();
  }, [!!props?.onReady]);

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
