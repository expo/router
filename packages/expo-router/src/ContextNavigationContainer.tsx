import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import React from "react";

import { useRootRouteNodeContext } from "./context";
import { getLinkingConfig } from "./getLinkingConfig";
import {
  RootNavigationRef,
  useRootNavigation,
  useRootNavigationState,
} from "./useRootNavigation";
import { SplashScreen } from "./views/Splash";

const navigationRef = createNavigationContainerRef();

type NavigationContainerProps = React.ComponentProps<
  typeof NavigationContainer
>;

const NavigationContainerContext = React.createContext<
  [
    Partial<NavigationContainerProps>,
    (props: Partial<NavigationContainerProps>) => void
  ]
>([{}, function () {}]);

export function useNavigationContainerContext() {
  const context = React.useContext(NavigationContainerContext);
  if (!context) {
    throw new Error(
      "useNavigationContainerContext must be used within a NavigationContainerContext"
    );
  }
  return context;
}

/** react-navigation `NavigationContainer` with automatic `linking` prop generated from the routes context. */
export function ContextNavigationContainer(props: NavigationContainerProps) {
  const [state, setState] = React.useState<Partial<NavigationContainerProps>>(
    {}
  );

  return (
    <NavigationContainerContext.Provider
      value={[
        {
          ...props,
          ...state,
        },
        setState,
      ]}
    >
      <InternalContextNavigationContainer />
    </NavigationContainerContext.Provider>
  );
}

function InternalContextNavigationContainer() {
  const [contextProps] = useNavigationContainerContext();
  const [isReady, setReady] = React.useState(false);
  const ref = React.useMemo(() => (isReady ? navigationRef : null), [isReady]);
  const root = useRootRouteNodeContext();
  const linking = React.useMemo(() => getLinkingConfig(root), [root]);

  React.useEffect(() => {
    contextProps.onReady?.();
  }, [!!contextProps?.onReady]);

  return (
    <RootNavigationRef.Provider value={{ ref }}>
      {!isReady && <SplashScreen />}
      {/* @ts-expect-error: children are required */}
      <NavigationContainer
        {...contextProps}
        linking={linking}
        ref={navigationRef}
        onReady={() => {
          // Allow one cycle for the children to mount a splash screen
          // that will prevent the splash screen from hiding.
          requestAnimationFrame(() => {
            setReady(true);
          });
        }}
      />
    </RootNavigationRef.Provider>
  );
}

export function RootContainer(
  props: Omit<
    NavigationContainerProps,
    "independent" | "ref" | "children" | "linking"
  >
) {
  const [, setProps] = useNavigationContainerContext();

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const restrictedProps = [
        "theme",
        "fallback",
        "independent",
        "onReady",
        "initialState",
        "onStateChange",
        "onUnhandledAction",
        "children",
        "linking",
      ];
      const invalidProps = Object.keys(props).filter((prop) =>
        restrictedProps.includes(prop)
      );

      if (invalidProps.length > 0) {
        console.warn(
          `RootContainer does not support the following props: ${invalidProps.join(
            ", "
          )}. Learn more: https://expo.github.io/router/docs/features/container#restrictions`
        );
      }
    }
  }, [props]);

  const {
    documentTitle,
    fallback,
    onReady,
    initialState,
    onStateChange,
    onUnhandledAction,
    theme,
  } = props;
  React.useEffect(() => {
    setProps({
      documentTitle,
      fallback,
      onReady,
      initialState,
      onStateChange,
      onUnhandledAction,
      theme,
    });
  }, [
    documentTitle,
    fallback,
    onReady,
    initialState,
    onStateChange,
    onUnhandledAction,
    theme,
  ]);

  return null;
}

RootContainer.useRef = useRootNavigation;
RootContainer.useState = useRootNavigationState;

/** Get the root navigation container ref. */
RootContainer.getRef = () => {
  return navigationRef;
};
