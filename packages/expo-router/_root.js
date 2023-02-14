import "@expo/metro-runtime";

import { ExpoRoot } from "expo-router";

import { getNavigationConfig } from "./build/getLinkingConfig";
import { getRoutes } from "./build/getRoutes";

// const ctx = require.context(process.env.EXPO_ROUTER_APP_ROOT);
const ctx = require.context(
  process.env.EXPO_ROUTER_APP_ROOT,
  true,
  /.*/,
  "lazy"
);

// Must be exported or Fast Refresh won't update the context >:[
export default function ExpoRouterRoot() {
  return <ExpoRoot context={ctx} />;
}

/** Get the linking manifest from a Node.js process. */
export function getManifest() {
  const routeTree = getRoutes(ctx);
  if (!routeTree) {
    return null;
  }
  return getNavigationConfig(routeTree);
}
