import "@expo/metro-runtime";
import React from "react";

import { ExpoRoot } from "expo-router";

import { getNavigationConfig } from "./src/getLinkingConfig";
import { getRoutes } from "./src/getRoutes";

// @ts-expect-error: Not sure
const ctx = require.context(
  process.env.EXPO_ROUTER_APP_ROOT,
  true,
  /.*/,
  "sync"
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
