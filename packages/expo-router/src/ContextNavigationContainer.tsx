import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import React from "react";

import { useLinkingConfig } from "./getLinkingConfig";
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

  const linking = useLinkingConfig();
  console.log("linking", linking);

  return (
    <NavigationContainerContext.Provider
      value={[
        {
          ...props,
          linking,
          ...state,
        },
        setState,
      ]}
    >
      <InternalContextNavigationContainer />
    </NavigationContainerContext.Provider>
  );
}

function InternalContextNavigationContainer(props: object) {
  const [contextProps] = useNavigationContainerContext();
  const [isReady, setReady] = React.useState(false);

  const ref = React.useMemo(() => (isReady ? navigationRef : null), [isReady]);

  return (
    <RootNavigationRef.Provider value={{ ref }}>
      {!isReady && <SplashScreen />}
      {/* @ts-expect-error: children are required */}
      <NavigationContainer
        {...props}
        {...contextProps}
        ref={navigationRef}
        onReady={() => {
          contextProps.onReady?.();
          setReady(true);
        }}
      />
    </RootNavigationRef.Provider>
  );
}

export function RootContainer({
  documentTitle,
  fallback,
  onReady,
  initialState,
  onStateChange,
  onUnhandledAction,
  theme,
}: Omit<
  NavigationContainerProps,
  "independent" | "ref" | "children" | "linking"
>) {
  const [, setProps] = useNavigationContainerContext();

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
