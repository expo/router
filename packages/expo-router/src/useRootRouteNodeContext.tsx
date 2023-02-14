import React, { createContext, useContext, useMemo } from "react";

import { RouteNode } from "./Route";
import { getRoutes } from "./getRoutes";
import { RequireContext } from "./types";

// Routes context
export const RootRouteNodeContext = createContext<RouteNode | null>(null);

if (process.env.NODE_ENV !== "production") {
  RootRouteNodeContext.displayName = "RoutesContext";
}

export function useRootRouteNodeContext() {
  const routes = useContext(RootRouteNodeContext);
  if (!routes) {
    throw new Error(
      "useRootRouteNodeContext is being used outside of RootRouteNodeContext.Provider"
    );
  }
  return routes;
}

/**
 * Asserts if the require.context has files that share the same name but have different extensions. Exposed for testing.
 * @private
 */
export function assertDuplicateRoutes(filenames: string[]) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const duplicates = filenames
    .map((filename) => filename.split(".")[0])
    .reduce((acc, filename) => {
      acc[filename] = acc[filename] ? acc[filename] + 1 : 1;
      return acc;
    }, {} as Record<string, number>);

  Object.entries(duplicates).forEach(([filename, count]) => {
    if (count > 1) {
      throw new Error(`Multiple files match the route name "${filename}".`);
    }
  });
}

/** Provide the require context as normalized routes. */
export function RootRouteNodeProvider({
  context,
  children,
}: {
  context: RequireContext;
  children: React.ReactNode;
}) {
  // TODO: Is this an optimal hook dependency?
  const keys = useMemo(() => {
    const keys = context.keys();
    assertDuplicateRoutes(keys);
    return keys;
  }, [context]);
  const routes = useMemo(() => getRoutes(context), [keys]);
  return (
    <RootRouteNodeContext.Provider value={routes}>
      {children}
    </RootRouteNodeContext.Provider>
  );
}
