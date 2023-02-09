import {
  createNavigationContainerRef,
  NavigationContainer as UpstreamNavigationContainer,
  NavigationContainerRefWithCurrent,
} from "@react-navigation/native";
import React from "react";

import { State } from "./fork/getPathFromState";
import { getLinkingConfig } from "./getLinkingConfig";
import { useRootRouteNodeContext } from "./useRootRouteNodeContext";
import { SplashScreen } from "./views/Splash";

type NavigationContainerProps = React.ComponentProps<
  typeof UpstreamNavigationContainer
>;

const navigationRef = createNavigationContainerRef();

const RootNavigationRef = React.createContext<{
  ref: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> | null;
}>({ ref: null });

if (process.env.NODE_ENV !== "production") {
  RootNavigationRef.displayName = "RootNavigationRef";
}

/** Get the root navigation container ref. */
export function getNavigationContainerRef() {
  return navigationRef;
}

export function useRootNavigation() {
  const context = React.useContext(RootNavigationRef);
  if (!context) {
    throw new Error(
      "useRootNavigation must be used within a NavigationContainerContext"
    );
  }
  return context.ref;
}

export function useRootNavigationState(): State | undefined {
  const navigation = useRootNavigation();
  const [state, setState] = React.useState(navigation?.getRootState());
  React.useEffect(() => {
    if (navigation) {
      setState(navigation.getRootState());
      const unsubscribe = navigation.addListener("state", ({ data }) => {
        setState(
          // @ts-expect-error: idk
          data.state
        );
      });
      return unsubscribe;
    }
    return undefined;
  }, [navigation]);

  return state;
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
