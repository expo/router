/// <reference types="./index" />

import "@expo/metro-runtime";

import React from "react";

import { ExpoRoot } from "./src";
import { RouteNode } from "./src/Route";
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
export default function ExpoRouterRoot({ location }: { location: URL }) {
  return <ExpoRoot context={ctx} location={location} />;
}

/** Get the linking manifest from a Node.js process. */
export async function getManifest(options: any) {
  const routeTree = getRoutes(ctx, options);

  if (!routeTree) {
    throw new Error("No routes found");
  }

  // Evaluate all static params
  await loadStaticParamsAsync(routeTree);

  return getNavigationConfig(routeTree);
}

/** Get the linking manifest from a Node.js process. */
export async function getDomEndpoints(options: any): Promise<string[]> {
  const routeTree = getRoutes(ctx, options);

  if (!routeTree) {
    throw new Error("No routes found");
  }

  // Recurse through the route tree and find all the +dom routes
  // create a list of URLs for each route with the `__skip=` query parameter

  const urls: string[] = [];

  function visitNode(node: RouteNode, parents: RouteNode[] = []) {
    if (node.dom) {
      const segments = parents.map((node) => node.route).join("/");

      console.log("parents:", parents, node);
      urls.push(
        segments +
          "/" +
          node.route +
          "?" +
          new URLSearchParams({
            __skip: segments,
          }).toString()
      );
    }

    if (node.children) {
      for (const child of node.children) {
        visitNode(child, [...parents, node]);
      }
    }
  }

  visitNode(routeTree, []);

  return urls;
}
