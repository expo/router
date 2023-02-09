import React, { ReactNode, useContext } from "react";

import { getNameFromFilePath, matchGroupName } from "./matchers";
import { RootRouteNodeContext } from "./useRootRouteNodeContext";

/** The list of input keys will become optional, everything else will remain the same. */
export type PickPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type DynamicConvention = { name: string; deep: boolean };

export type RouteNode = {
  /** Load a route into memory. Returns the exports from a route. */
  loadRoute: () => any;
  /** Loaded initial route name. */
  initialRouteName?: string;
  /** nested routes */
  children: RouteNode[];
  /** Is the route a dynamic path */
  dynamic: null | DynamicConvention[];
  /** `index`, `error-boundary`, etc. */
  route: string;
  /** Context Module ID, used for matching children. */
  contextKey: string;
  /** Added in-memory */
  generated?: boolean;
  /** Internal screens like the directory or the auto 404 should be marked as internal. */
  internal?: boolean;
};

const CurrentRoutePathContext = React.createContext<string | null>(null);

const CurrentRouteContext = React.createContext<RouteNode | null>(null);

if (process.env.NODE_ENV !== "production") {
  CurrentRoutePathContext.displayName = "RoutePath";
  CurrentRouteContext.displayName = "Route";
}

/** Return the RouteNode at the current contextual boundary. */
export function useRouteNode(): RouteNode | null {
  return useContext(CurrentRouteContext);
}

export function useContextKey(): string {
  const filename = useContext(CurrentRoutePathContext);
  if (filename == null) {
    throw new Error("No filename found. This is likely a bug in expo-router.");
  }
  return filename;
}

/** Provides the matching routes and filename to the children. */
export function Route({
  children,
  node,
}: {
  children: ReactNode;
  node: RouteNode;
}) {
  const normalName = React.useMemo(() => {
    // The root path is `` (empty string) so always prepend `/` to ensure
    // there is some value.
    const normal = "/" + getNameFromFilePath(node.contextKey);
    if (!normal.endsWith("_layout")) {
      return normal;
    }
    return normal.replace(/\/?_layout$/, "");
  }, [node.contextKey]);

  return (
    <CurrentRoutePathContext.Provider value={normalName}>
      <CurrentRouteContext.Provider value={node}>
        {children}
      </CurrentRouteContext.Provider>
    </CurrentRoutePathContext.Provider>
  );
}

export function useRootRoute(): RouteNode | null {
  return useContext(RootRouteNodeContext);
}

export function sortRoutesWithInitial(initialRouteName?: string) {
  return (a: RouteNode, b: RouteNode): number => {
    if (initialRouteName) {
      if (a.route === initialRouteName) {
        return -1;
      }
      if (b.route === initialRouteName) {
        return 1;
      }
    }
    return sortRoutes(a, b);
  };
}

export function sortRoutes(a: RouteNode, b: RouteNode): number {
  if (a.dynamic && !b.dynamic) {
    return 1;
  }
  if (!a.dynamic && b.dynamic) {
    return -1;
  }
  if (a.dynamic && b.dynamic) {
    if (a.dynamic.length !== b.dynamic.length) {
      return b.dynamic.length - a.dynamic.length;
    }
    for (let i = 0; i < a.dynamic.length; i++) {
      const aDynamic = a.dynamic[i];
      const bDynamic = b.dynamic[i];
      if (aDynamic.deep && !bDynamic.deep) {
        return 1;
      }
      if (!aDynamic.deep && bDynamic.deep) {
        return -1;
      }
    }
    return 0;
  }

  const aIndex = a.route === "index" || matchGroupName(a.route) != null;
  const bIndex = b.route === "index" || matchGroupName(b.route) != null;

  if (aIndex && !bIndex) {
    return -1;
  }
  if (!aIndex && bIndex) {
    return 1;
  }

  return a.route.length - b.route.length;
}
