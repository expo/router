import { getRoutes } from "./build/getRoutes";
import { getNavigationConfig } from "./build/getLinkingConfig";

/** Get the linking manifest from a Node.js process. */
export function getManifestFromContextModule(contextModule) {
  const routeTree = getRoutes(contextModule);
  if (!routeTree) {
    return {};
  }
  return getNavigationConfig(routeTree);
}

// Must be exported or Fast Refresh won't update the context >:[
export function getManifest() {
  // Babel + Expo CLI: process.env.EXPO_ROUTER_APP_ROOT -> '../../apps/demo/app'
  //   console.log("output", process.env.EXPO_ROUTER_APP_ROOT);
  const ctx = require.context(process.env.EXPO_ROUTER_APP_ROOT);
  return getManifestFromContextModule(ctx);
}
