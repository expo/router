import { getNavigationConfig } from "./build/getLinkingConfig";
import { getRoutes } from "./build/getRoutes";

/** Get the linking manifest from a Node.js process. */
export function getManifestFromContextModule(contextModule) {
  const routeTree = getRoutes(contextModule);
  if (!routeTree) {
    return {};
  }
  return getNavigationConfig(routeTree);
}

export function getManifest() {
  const ctx = require.context(process.env.EXPO_ROUTER_APP_ROOT);
  return getManifestFromContextModule(ctx);
}
