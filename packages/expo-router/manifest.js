import { getNavigationConfig } from "./build/getLinkingConfig";
import { getRoutes } from "./build/getRoutes";
import { getRouteMatchingConfig } from "./build/fork/getStateFromPath";

/** Get the linking manifest from a Node.js process. */
export function getManifestFromContextModule(contextModule) {
  const routeTree = getRoutes(contextModule, { preserveApiRoutes: true });
  if (!routeTree) {
    return {};
  }
  return getNavigationConfig(routeTree);
}

// Must be exported or Fast Refresh won't update the context >:[
export function getManifest() {
  const ctx = require.context(process.env.EXPO_ROUTER_APP_ROOT);
  const config = getManifestFromContextModule(ctx);

  config.routes = getRouteMatchingConfig(config).configs;
  return config;
}
