/// <reference types="../../types/jest.d.ts" />
import "./expect";

import { BaseNavigationContainer } from "@react-navigation/core";
import { render, RenderResult } from "@testing-library/react-native";
import { findAll } from "@testing-library/react-native/build/helpers/findAll";
import path from "path";
import React from "react";

import { ExpoRoot } from "../ExpoRoot";
import { stateCache } from "../getLinkingConfig";
import { RequireContext } from "../types";
import {
  FileStub,
  inMemoryContext,
  requireContext,
  requireContextWithOverrides,
} from "./context-stubs";
import { initialUrlRef } from "./mocks";

// re-export everything
export * from "@testing-library/react-native";

type RenderRouterOptions = Parameters<typeof render>[1] & {
  initialUrl?: any;
};

type Result = ReturnType<typeof render> & {
  getPathname(): string;
  getSearchParams(): URLSearchParams;
};

function isOverrideContext(
  context: object
): context is { appDir: string; overrides: Record<string, FileStub> } {
  return Boolean(typeof context === "object" && "appDir" in context);
}

export function renderRouter(
  context?: string,
  options?: RenderRouterOptions
): Result;
export function renderRouter(
  context: Record<string, FileStub>,
  options?: RenderRouterOptions
): Result;
export function renderRouter(
  context: { appDir: string; overrides: Record<string, FileStub> },
  options?: RenderRouterOptions
): Result;
export function renderRouter(
  context:
    | string
    | { appDir: string; overrides: Record<string, FileStub> }
    | Record<string, FileStub> = "./app",
  { initialUrl = "/", ...options }: RenderRouterOptions = {}
): Result {
  jest.useFakeTimers();

  let ctx: RequireContext;

  // Reset the initial URL
  initialUrlRef.value = initialUrl as any;

  // Force the render to be synchronous
  process.env.EXPO_ROUTER_IMPORT_MODE_WEB = "sync";
  process.env.EXPO_ROUTER_IMPORT_MODE_IOS = "sync";
  process.env.EXPO_ROUTER_IMPORT_MODE_ANDROID = "sync";

  if (typeof context === "string") {
    ctx = requireContext(path.resolve(process.cwd(), context));
  } else if (isOverrideContext(context)) {
    ctx = requireContextWithOverrides(context.appDir, context.overrides);
  } else {
    ctx = inMemoryContext(context);
  }

  stateCache.clear();

  let location: URL | undefined;

  if (typeof initialUrl === "string") {
    location = new URL(initialUrl, "test://test");
  } else if (initialUrl instanceof URL) {
    location = initialUrl;
  }

  const result = render(<ExpoRoot context={ctx} location={location} />, {
    ...options,
  });

  return Object.assign(result, {
    getPathname(this: RenderResult): string {
      const containers = findAll(this.root, (node) => {
        return node.type === BaseNavigationContainer;
      });

      return (
        "/" +
        containers
          .flatMap((route) => {
            return route.props.initialState.routes.map((r: any) => r.name);
          })
          .join("/")
      );
    },
    getSearchParams(this: RenderResult): URLSearchParams {
      const containers = findAll(this.root, (node) => {
        return node.type === BaseNavigationContainer;
      });

      const params = containers.reduce<Record<string, string>>((acc, route) => {
        return { ...acc, ...route.props.initialState.routes[0].params };
      }, {});

      return new URLSearchParams(params);
    },
  });
}
