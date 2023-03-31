import "./mocks";

import { render } from "@testing-library/react-native";
import path from "path";
import React from "react";

import requireContext from "./require-context-ponyfill";
import { ExpoRoot } from "../ExpoRoot";
import { RequireContext } from "../types";

type RenderRouterOptions = Parameters<typeof render>[1] & {
  initialUrl?: string;
};

type RouteOverrideFunction = () => React.ReactElement<any, any> | null;

type RouteOverride = { default: RouteOverrideFunction } | RouteOverrideFunction;

const initialUrlRef = {
  value: "/",
  then(onfulfilled: (v: string) => string) {
    this.value = onfulfilled?.(this.value);
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

  return render(<></>, {
    wrapper: () => <ExpoRoot context={ctx} />,
    ...options,
  });
}

// re-export everything
export * from "@testing-library/react-native";
