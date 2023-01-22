import { getRoutes } from "./getRoutes";
import { getNavigationConfig } from "./getLinkingConfig";
import { RequireContext } from "./types";

/** Get the linking manifest from a Node.js process. */
export function getManifest(contextModule: RequireContext) {
  const routeTree = getRoutes(contextModule);
  if (!routeTree) {
    return {};
  }
  return getNavigationConfig(routeTree);
}
