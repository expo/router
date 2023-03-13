import { findFocusedRoute } from "expo-router/src/fork/findFocusedRoute";
import getStateFromPath from "expo-router/src/fork/getStateFromPath";
import { getReactNavigationConfig } from "expo-router/src/getReactNavigationConfig";
import { getRoutes } from "expo-router/src/getRoutes";
import { RequireContext } from "expo-router/src/types";

function createMockContextModule(map: string[]) {
  const contextModule = (key) => ({ default() {} });

  Object.defineProperty(contextModule, "keys", {
    value: () => map,
  });

  return contextModule as unknown as RequireContext;
}

export function buildMatcher(
  filePaths: string[]
): (path: string) => null | ReturnType<typeof findFocusedRoute> {
  const ctx = createMockContextModule(filePaths);
  const routeTree = getRoutes(ctx);

  if (!routeTree) {
    return () => null;
  }
  const config = getReactNavigationConfig(routeTree, false);

  return (path: string) => {
    const state = getStateFromPath(path, config);
    if (state) {
      return findFocusedRoute(state);
    }
    return null;
  };
}
