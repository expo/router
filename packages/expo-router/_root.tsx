/// <reference path="metro-require.d.ts" />

import "@expo/metro-runtime";

import { ExpoRoot } from "expo-router";
import React from "react";

import { getNavigationConfig } from "./src/getLinkingConfig";
import { getRoutes } from "./src/getRoutes";

const ctx = require.context(process.env.EXPO_ROUTER_APP_ROOT!);

// Must be exported or Fast Refresh won't update the context >:[
export default function ExpoRouterRoot() {
  return <ExpoRoot context={ctx} />;
}

/** Get the linking manifest from a Node.js process. */
export function getManifest() {
  const routeTree = getRoutes(ctx, { preserveApiRoutes: true });
  if (!routeTree) {
    return null;
  }
  return getNavigationConfig(routeTree);
}
