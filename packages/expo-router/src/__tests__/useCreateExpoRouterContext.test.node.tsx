import { render } from "@testing-library/react-native";
import React from "react";

import { RequireContext } from "../types";
import {
  ExpoRootProps,
  useCreateExpoRouterContext,
  createExpoRouterContext,
} from "../useCreateExpoRouterContext";

describe(createExpoRouterContext, () => {
  it(`creates mock context with empty routes`, () => {
    expect(
      createExpoRouterContext({
        context: createMockContextModule({}),
      })
    ).toEqual({
      getRouteInfo: expect.any(Function),
      initialState: undefined,
      linking: {
        prefixes: [],
      },
      routeNode: null,
    });
  });
  it(`creates qualified context with routes`, () => {
    const ctx = createExpoRouterContext({
      context: createMockContextModule({
        "./index.tsx": {
          default: () => null,
        },
      }),
    });

    expect(ctx.linking).toEqual({
      config: {
        initialRouteName: undefined,
        screens: { "[...404]": "*404", _sitemap: "_sitemap", index: "" },
      },
      getActionFromState: expect.any(Function),
      getInitialURL: expect.any(Function),
      getPathFromState: expect.any(Function),
      getStateFromPath: expect.any(Function),
      prefixes: [],
      subscribe: expect.any(Function),
    });

    // Important
    expect(ctx.initialState).toEqual(undefined);

    expect(ctx.routeNode).toEqual({
      children: [
        {
          children: [],
          contextKey: "./index.tsx",
          dynamic: null,
          loadRoute: expect.any(Function),
          route: "index",
        },
        {
          children: [],
          contextKey: "./_sitemap.tsx",
          dynamic: null,
          generated: true,
          internal: true,
          loadRoute: expect.any(Function),
          route: "_sitemap",
        },
        {
          children: [],
          contextKey: "./[...404].tsx",
          dynamic: [{ deep: true, name: "404" }],
          generated: true,
          internal: true,
          loadRoute: expect.any(Function),
          route: "[...404]",
        },
      ],
      contextKey: "./_layout.tsx",
      dynamic: null,
      generated: true,
      loadRoute: expect.any(Function),
      route: "",
    });
  });
  it(`creates qualified context with routes and initial state`, () => {
    const ctx = createExpoRouterContext({
      location: new URL("/", "http://acme.com"),
      context: createMockContextModule({
        "./index.tsx": {
          default: () => null,
        },
      }),
    });

    expect(ctx.initialState).toEqual({
      routes: [{ name: "index", path: "/" }],
    });
  });
});

function createMockContextModule(
  map: Record<string, Record<string, any>> = {}
) {
  const contextModule = jest.fn((key) => map[key]);

  Object.defineProperty(contextModule, "keys", {
    value: () => Object.keys(map),
  });

  return contextModule as unknown as RequireContext;
}

function MockComponent(props: ExpoRootProps) {
  useCreateExpoRouterContext(props);
  return null;
}

describe(useCreateExpoRouterContext, () => {
  beforeEach(() => {
    // @ts-expect-error
    jest.spyOn(Array.prototype, "reduce");
  });
  it(`computes on render`, () => {
    render(
      <MockComponent
        context={createMockContextModule({})}
        location={undefined}
      />
    );

    expect(Array.prototype.reduce).toHaveBeenCalled();
  });

  it("does not re-compute the value when props are the same", () => {
    const context = createMockContextModule({});
    const location = new URL("/hello", "https://acme.com");
    const { rerender } = render(
      <MockComponent context={context} location={location} />
    );

    // @ts-expect-error
    Array.prototype.reduce.mockClear();

    rerender(<MockComponent context={context} location={location} />);

    expect(Array.prototype.reduce).not.toHaveBeenCalled();
  });

  it("re-computes the value when context changes", () => {
    const location = new URL("/hello", "https://acme.com");
    const { rerender } = render(
      <MockComponent
        context={createMockContextModule({})}
        location={location}
      />
    );

    // @ts-expect-error
    Array.prototype.reduce.mockClear();

    rerender(
      <MockComponent
        context={createMockContextModule({ "hello.js": { default: null } })}
        location={location}
      />
    );

    expect(Array.prototype.reduce).toHaveBeenCalled();
  });
});
