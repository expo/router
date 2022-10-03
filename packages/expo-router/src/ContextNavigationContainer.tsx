import {
  createNavigationContainerRef,
  findFocusedRoute,
  NavigationContainer,
} from "@react-navigation/native";
import React, { useCallback } from "react";

import { useLinkingConfig } from "./getLinkingConfig";
import SplashModule from "./splash";
import { VirtualRouteContext } from "./useCurrentRoute";

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

function trimQuery(pathname: string): string {
  const queryIndex = pathname.indexOf("?");
  if (queryIndex !== -1) {
    return pathname.substring(0, queryIndex);
  }
  return pathname;
}

function InternalContextNavigationContainer(props: object) {
  const [contextProps] = useNavigationContainerContext();
  const [state, setState] = React.useState<{
    pathname: string | null;
    query: Record<string, any>;
  }>({ pathname: null, query: {} });

  const onStateChange = useCallback(
    (state) => {
      if (state) {
        const currentRoute = findFocusedRoute(state);
        setState({
          pathname: trimQuery(currentRoute?.path ?? "/"),
          query: currentRoute?.params ?? {},
        });
      }
    },
    [setState]
  );

  return (
    <VirtualRouteContext.Provider value={state}>
      {/* @ts-expect-error: children are required */}
      <NavigationContainer
        {...props}
        {...contextProps}
        ref={navigationRef}
        onReady={() => {
          contextProps.onReady?.();
          SplashModule?.hideAsync();
          const initialState = navigationRef.current?.getRootState();
          onStateChange(initialState);
        }}
        onStateChange={(state) => {
          contextProps.onStateChange?.(state);
          onStateChange(state);
        }}
      />
    </VirtualRouteContext.Provider>
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

/** Get the root navigation container ref. */
RootContainer.getRef = () => {
  return navigationRef;
};
