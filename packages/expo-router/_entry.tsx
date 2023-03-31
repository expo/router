/// <reference path="metro-require.d.ts" />

import "@expo/metro-runtime";

import React from "react";

import { ExpoRoot } from "./src";
import { getNavigationConfig } from "./src/getLinkingConfig";
import { getRoutes } from "./src/getRoutes";
import { loadStaticParamsAsync } from "./src/loadStaticParamsAsync";

export const ctx = require.context(
  process.env.EXPO_ROUTER_APP_ROOT!,
  true,
  /.*/,
  // @ts-expect-error
  process.env.EXPO_ROUTER_IMPORT_MODE!
);

// Must be exported or Fast Refresh won't update the context >:[
export default function ExpoRouterRoot() {
  return <ExpoRoot context={ctx} />;
}

/** Get the linking manifest from a Node.js process. */
export async function getManifest(options: any) {
  const routeTree = getRoutes(ctx, options);
  if (!routeTree) {
    return null;
  }

  // Evaluate all static params
  await loadStaticParamsAsync(routeTree);

  return getNavigationConfig(routeTree);
}
