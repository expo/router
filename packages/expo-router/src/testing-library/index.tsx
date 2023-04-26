/// <reference types="../../types/jest.d.ts" />
import "./mocks";
import "./expect";

import { BaseNavigationContainer } from "@react-navigation/core";
import { render, RenderResult } from "@testing-library/react-native";
import { findAll } from "@testing-library/react-native/build/helpers/findAll";
import path from "path";
import React from "react";

import { ExpoRoot } from "../ExpoRoot";
import { RequireContext } from "../types";
import requireContext from "./require-context-ponyfill";

// re-export everything
export * from "@testing-library/react-native";

type RenderRouterOptions = Parameters<typeof render>[1] & {
  initialUrl?: string;
};

type RouteOverrideFunction = () => React.ReactElement<any, any> | null;

type RouteOverride = { default: RouteOverrideFunction } | RouteOverrideFunction;

const initialUrlRef = {
  value: "/",
  then(onfulfilled: (v: string) => string) {
    const nextValue = onfulfilled?.(this.value);
    if (nextValue !== undefined) {
      this.value = nextValue;
    }
    return this;
  },
  catch() {
    return this;
  },
};

jest.mock("expo-linking", () => {
  const module: typeof import("expo-linking") = {
    ...jest.requireActual("expo-linking"),
    addEventListener() {
      return { remove() {} } as any;
    },
    getInitialURL() {
      return initialUrlRef as unknown as Promise<string>;
    },
  };

  return module;
});

function isOverrideContext(
  context: object
): context is { appDir: string; overrides: Record<string, RouteOverride> } {
  return Boolean(typeof context === "object" && "appDir" in context);
}

export function renderRouter(
  context?: string,
  options?: RenderRouterOptions
): ReturnType<typeof render>;
export function renderRouter(
  context: Record<string, RouteOverride>,
  options?: RenderRouterOptions
): ReturnType<typeof render>;
export function renderRouter(
  context: { appDir: string; overrides: Record<string, RouteOverride> },
  options?: RenderRouterOptions
): ReturnType<typeof render>;
export function renderRouter(
  context:
    | string
    | { appDir: string; overrides: Record<string, RouteOverride> }
    | Record<string, RouteOverride> = "./app",
  { initialUrl = "/", ...options }: RenderRouterOptions = {}
): ReturnType<typeof render> {
  jest.useFakeTimers();

  let ctx: RequireContext;

  // Reset the initial URL
  initialUrlRef.value = initialUrl;

  if (typeof context === "string") {
    ctx = requireContext(path.resolve(process.cwd(), context));
  } else if (isOverrideContext(context)) {
    const existingContext = requireContext(
      path.resolve(process.cwd(), context.appDir)
    );

    ctx = Object.assign(
      function (id: string) {
        if (id in context.overrides) {
          const route = context.overrides[id];
          return typeof route === "function" ? { default: route } : route;
        } else {
          return existingContext(id);
        }
      },
      {
        keys: () => [
          ...Object.keys(context.overrides),
          ...existingContext.keys(),
        ],
        resolve: (key: string) => key,
        id: "0",
      }
    );
  } else {
    ctx = Object.assign(
      function (id: string) {
        return typeof context[id] === "function"
          ? { default: context[id] }
          : context[id];
      },
      {
        keys: () => Object.keys(context),
        resolve: (key: string) => key,
        id: "0",
      }
    );
  }

  const result = render(<ExpoRoot context={ctx} />, {
    ...options,
  });

  Object.assign(result, {
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

  return result;
}
