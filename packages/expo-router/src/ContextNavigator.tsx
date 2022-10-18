import React, { useMemo } from "react";

import { ContextNavigationContainer } from "./ContextNavigationContainer";
import { RootRouteNodeContext, useRootRouteNodeContext } from "./context";
import { getRoutes } from "./getRoutes";
import { useTutorial } from "./onboard/useTutorial";
import { RequireContext } from "./types";
import { getQualifiedRouteComponent } from "./useScreens";

function useContextModuleAsRoutes(context: RequireContext) {
  // TODO: Is this an optimal hook dependency?
  const keys = useMemo(() => context.keys(), [context]);
  return useMemo(() => getRoutes(context), [keys]);
}

function RootRouteNodeProvider({
  context,
  children,
}: {
  context: RequireContext;
  children: React.ReactNode;
}) {
  const routes = useContextModuleAsRoutes(context);
  return (
    <RootRouteNodeContext.Provider value={routes}>
      {children}
    </RootRouteNodeContext.Provider>
  );
}

export function ContextNavigator({ context }: { context: RequireContext }) {
  const Tutorial = useTutorial(context);
  if (Tutorial) {
    return <Tutorial />;
  }

  return (
    <RootRouteNodeProvider context={context}>
      <ContextNavigationContainer>
        <RootRoute />
      </ContextNavigationContainer>
    </RootRouteNodeProvider>
  );
}

function RootRoute() {
  const root = useRootRouteNodeContext();

  if (!root) {
    return null;
  }

  const Component = getQualifiedRouteComponent(root);
  // @ts-expect-error: TODO: Drop navigation and route props
  return <Component />;
}
