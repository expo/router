import React, { ReactNode, useContext } from "react";

import { RoutesContext } from "./context";
import { getNameFromFilePath, matchFragmentName } from "./matchers";

/** The list of input keys will become optional, everything else will remain the same. */
export type PickPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type RouteNode = {
  /** nested routes */
  children: RouteNode[];
  /** Lazily get the React component */
  getComponent: () => React.ComponentType<any>;
  /** Is the route a dynamic path */
  dynamic: null | { name: string; deep: boolean };
  /** All static exports from the file. */
  getExtras: () => Record<string, any>;
  /** `index`, `error-boundary`, etc. */
  route: string;
  /** require.context key, used for matching children. */
  contextKey: string;
  /** Added in-memory */
  generated?: boolean;

  /** Internal screens like the directory or the auto 404 should be marked as internal. */
  internal?: boolean;
};

const CurrentRoutePathContext = React.createContext<string | null>(null);

const CurrentRouteContext = React.createContext<RouteNode[]>([]);

if (process.env.NODE_ENV !== "production") {
  CurrentRoutePathContext.displayName = "RoutePath";
  CurrentRouteContext.displayName = "Route";
}

/** Return all the routes for the current boundary. */
export function useRoutes(): RouteNode[] {
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
  filename,
  children,
}: {
  filename: string;
  children: ReactNode;
}) {
  const normalName = React.useMemo(
    () => getNameFromFilePath(filename),
    [filename]
  );
  const layoutName = React.useMemo(() => {
    if (!normalName.endsWith("_layout")) {
      return null;
    }
    return normalName.replace(/\/?_layout$/, "");
  }, [normalName]);

  return (
    <CurrentRoutePathContext.Provider
      value={
        // The root path is `` (empty string) so always prepend `/` to ensure
        // there is some value.
        "/" + (layoutName ?? normalName)
      }
    >
      {layoutName != null ? (
        <LayoutRoute filename={layoutName}>{children}</LayoutRoute>
      ) : (
        children
      )}
    </CurrentRoutePathContext.Provider>
  );
}

export function LayoutRoute({
  filename,
  children,
}: {
  filename: string;
  children: ReactNode;
}) {
  const routes = useRoutesAtPath(filename);
  return (
    <CurrentRouteContext.Provider value={routes}>
      {children}
    </CurrentRouteContext.Provider>
  );
}

export function useRootRoute(): RouteNode | null {
  return useContext(RoutesContext);
}

/**
 * Given a route and a normalized path, return the matching child routes.
 *
 * @param normalName Normalized file path relative to the app directory: `foo/bar`
 * @param route A route node.
 * @returns
 */
function getChildRoutes(
  normalName: string,
  route: RouteNode | null
): RouteNode[] {
  let children: RouteNode[] = route?.children ?? [];

  // Skip root directory
  if (!normalName) {
    return children;
  }

  // split and search
  const parts = normalName.split("/");
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    const getNext = () => {
      const next = children.find(({ route }) => route === part);
      if (!next?.children) {
        if (i < parts.length - 1) {
          // If no children matched a single segment
          // then increment and append the next segment
          // this allows for nested directories without layouts.
          i++;
          part += "/" + parts[i];
          return getNext();
        }
        return null;
      }
      return next;
    };
    const next = getNext();
    if (!next?.children) {
      return [];
    }
    children = next?.children;
  }

  for (const child of children) {
    if (child.generated && child.children.length) {
      // remove child
      const nextChildren = getChildRoutes(
        getNameFromFilePath(child.contextKey),
        route
      );
      if (nextChildren.length) {
        children = children.filter((c) => c !== child);

        children.push(
          ...nextChildren.map((nextChild) => {
            nextChild.route = child.route + "/" + nextChild.route;
            return nextChild;
          })
        );
      }
    }
  }

  return children;
}

function useRoutesAtPath(normalName: string): RouteNode[] {
  const route = useContext(RoutesContext);

  return React.useMemo(
    () => getChildRoutes(normalName, route).sort(sortRoutes),
    [normalName]
  );
}

export function sortRoutes(a: RouteNode, b: RouteNode): number {
  if (a.dynamic && !b.dynamic) {
    return 1;
  }
  if (!a.dynamic && b.dynamic) {
    return -1;
  }
  if (a.dynamic && b.dynamic) {
    if (a.dynamic.deep && !b.dynamic.deep) {
      return 1;
    }
    if (!a.dynamic.deep && b.dynamic.deep) {
      return -1;
    }
    return 0;
  }

  const aIndex = a.route === "index" || matchFragmentName(a.route) != null;
  const bIndex = b.route === "index" || matchFragmentName(b.route) != null;

  if (aIndex && !bIndex) {
    return -1;
  }
  if (!aIndex && bIndex) {
    return 1;
  }

  return a.route.length - b.route.length;
}
