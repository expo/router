import React, { useMemo } from "react";

import { ContextNavigationContainer } from "./ContextNavigationContainer";
import { RoutesContext, useRoutesContext } from "./context";
import { getRoutes } from "./getRoutes";
import { RequireContext } from "./types";
import { getQualifiedRouteComponent } from "./useScreens";

function useContextModuleAsRoutes(context: RequireContext) {
  // TODO: Is this an optimal hook dependency?
  const keys = useMemo(() => context.keys(), [context]);
  return useMemo(() => getRoutes(context), [keys]);
}

function RoutesContextProvider({
  context,
  children,
}: {
  context: RequireContext;
  children: React.ReactNode;
}) {
  const routes = useContextModuleAsRoutes(context);
  return (
    <RoutesContext.Provider value={routes}>{children}</RoutesContext.Provider>
  );
}

function isFunctionOrReactComponent(
  Component: any
): Component is React.ComponentType {
  return (
    !!Component &&
    (typeof Component === "function" ||
      Component?.prototype?.isReactComponent ||
      Component.$$typeof === Symbol.for("react.forward_ref"))
  );
}

/** Returns the Tutorial component if there are no React components exported as default from any files in the provided context module. */
function useTutorial(context: RequireContext) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const keys = useMemo(() => context.keys(), [context]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hasAnyValidComponent = useMemo(() => {
    for (const key of keys) {
      // NOTE(EvanBacon): This should only ever occur in development as it breaks lazily loading.
      const component = context(key)?.default;
      if (isFunctionOrReactComponent(component)) {
        return true;
      }
    }
    return false;
  }, [keys]);

  if (hasAnyValidComponent) {
    return null;
  }

  return require("./onboard/Tutorial").Tutorial;
}

export function ContextNavigator({ context }: { context: RequireContext }) {
  const Tutorial = useTutorial(context);
  if (Tutorial) {
    return <Tutorial />;
  }

  return (
    <RoutesContextProvider context={context}>
      <ContextNavigationContainer>
        <RootRoute />
      </ContextNavigationContainer>
    </RoutesContextProvider>
  );
}

function RootRoute() {
  const root = useRoutesContext();

  if (!root) {
    return null;
  }

  const Component = getQualifiedRouteComponent(root);
  // @ts-expect-error: TODO: Drop navigation and route props
  return <Component />;
}
