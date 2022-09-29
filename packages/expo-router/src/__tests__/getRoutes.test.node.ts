import { RouteNode } from "../Route";
import {
  getRoutes,
  createRouteNode,
  getUserDefinedDeepDynamicRoute,
} from "../getRoutes";
import { RequireContext } from "../types";

function createMockContextModule(
  map: Record<string, Record<string, any>> = {}
) {
  const contextModule = jest.fn((key) => map[key]);

  Object.defineProperty(contextModule, "keys", {
    value: () => Object.keys(map),
  });

  return contextModule as unknown as RequireContext;
}

const ROUTE_404 = {
  children: [],
  contextKey: "./[...404].tsx",
  dynamic: { deep: true, name: "404" },
  generated: true,
  getComponent: expect.any(Function),
  getExtras: expect.any(Function),
  internal: true,
  route: "[...404]",
};
const ROUTE_DIRECTORY = {
  children: [],
  contextKey: "./__index.tsx",
  dynamic: null,
  generated: true,
  getComponent: expect.any(Function),
  getExtras: expect.any(Function),
  internal: true,
  route: "__index",
};

const asRouteNode = (route: Partial<RouteNode>) =>
  createRouteNode({
    getComponent(): any {
      return function () {
        return null;
      };
    },
    getExtras(): any {
      return {};
    },
    route: "INVALID_TEST_VALUE",
    contextKey: "INVALID_TEST_VALUE",
    ...route,
  });

describe(getUserDefinedDeepDynamicRoute, () => {
  it(`should return a basic deep dynamic route`, () => {
    const routes = [
      asRouteNode({
        route: "[...404]",
      }),
    ];
    expect(getUserDefinedDeepDynamicRoute(routes)).toEqual(routes[0]);
  });
  it(`does not return a nested deep dynamic route `, () => {
    const deep = asRouteNode({
      route: "[...404]",
    });
    const routes = [
      asRouteNode({
        route: "home",
        children: [deep],
      }),
    ];
    expect(getUserDefinedDeepDynamicRoute(routes)).toEqual(null);
  });
  it(`should return a top-level deep dynamic route when nested in a group`, () => {
    const deep = asRouteNode({
      route: "[...404]",
    });
    const routes = [
      asRouteNode({
        route: "(group)",
        children: [
          asRouteNode({
            route: "(another)",
            children: [deep],
          }),
        ],
      }),
    ];
    expect(getUserDefinedDeepDynamicRoute(routes)).toEqual(deep);
  });
  it(`does not return a dynamic route`, () => {
    expect(
      getUserDefinedDeepDynamicRoute([
        // [404].js
        asRouteNode({
          route: "[404]",
        }),
      ])
    ).toEqual(null);

    expect(
      getUserDefinedDeepDynamicRoute([
        // home/
        asRouteNode({
          route: "home",
          children: [
            // [404].js
            asRouteNode({
              route: "[404]",
            }),
          ],
        }),
      ])
    ).toEqual(null);
  });
});

describe(getRoutes, () => {
  it(`should add missing layouts for nested routes`, () => {
    expect(
      getRoutes(
        createMockContextModule({
          "./some/nested/value.tsx": { default() {} },
        })
      )
    ).toEqual([
      {
        children: [
          {
            children: [
              {
                children: [],
                contextKey: "./some/nested/value.tsx",
                dynamic: null,
                getComponent: expect.any(Function),
                getExtras: expect.any(Function),
                route: "value",
              },
            ],
            contextKey: "./some/nested.tsx",
            dynamic: null,
            generated: true,
            getComponent: expect.any(Function),
            getExtras: expect.any(Function),
            route: "nested",
          },
        ],
        contextKey: "./some.tsx",
        dynamic: null,
        generated: true,
        getComponent: expect.any(Function),
        getExtras: expect.any(Function),
        route: "some",
      },
      ROUTE_DIRECTORY,
      ROUTE_404,
    ]);
  });

  it(`get dynamic routes`, () => {
    expect(
      getRoutes(
        createMockContextModule({
          "./[dynamic].tsx": { default() {} },
          "./[...deep].tsx": { default() {} },
        })
      )
    ).toEqual([
      {
        children: [],
        contextKey: "./[dynamic].tsx",
        dynamic: {
          deep: false,
          name: "dynamic",
        },
        getComponent: expect.any(Function),
        getExtras: expect.any(Function),
        route: "[dynamic]",
      },
      {
        children: [],
        contextKey: "./[...deep].tsx",
        dynamic: {
          deep: true,
          name: "deep",
        },
        getComponent: expect.any(Function),
        getExtras: expect.any(Function),
        route: "[...deep]",
      },
      ROUTE_DIRECTORY,
      // No 404 route because we have a dynamic route
    ]);
  });

  it(`should convert a complex context module routes`, () => {
    expect(
      getRoutes(
        createMockContextModule({
          "./(stack).tsx": { default() {} },
          "./(stack)/home.tsx": { default() {} },
          "./(stack)/settings.tsx": { default() {} },
          "./(stack)/user/(default)/posts.tsx": { default() {} },
          "./(stack)/user/(default).tsx": { default() {} },
          "./(stack)/user/profile.tsx": { default() {} },
          "./(stack)/user/[profile].tsx": { default() {} },
          "./(stack)/user/settings.tsx": { default() {} },
          "./(stack)/user/settings/info.tsx": { default() {} },
          "./(stack)/user/settings/[...other].tsx": { default() {} },
          "./another.tsx": { default() {} },
          "./some/nested/value.tsx": { default() {} },
        })
      )
    ).toEqual([
      mockRoute({
        children: [
          mockRoute({
            contextKey: "./(stack)/home.tsx",
            route: "home",
          }),
          mockRoute({
            contextKey: "./(stack)/settings.tsx",
            route: "settings",
          }),
          mockRoute({
            children: [
              mockRoute({
                children: [
                  mockRoute({
                    contextKey: "./(stack)/user/(default)/posts.tsx",
                    route: "posts",
                  }),
                ],
                contextKey: "./(stack)/user/(default).tsx",
                route: "(default)",
              }),
              mockRoute({
                contextKey: "./(stack)/user/profile.tsx",
                route: "profile",
              }),
              mockRoute({
                contextKey: "./(stack)/user/[profile].tsx",
                dynamic: {
                  deep: false,
                  name: "profile",
                },
                route: "[profile]",
              }),
              mockRoute({
                children: [
                  mockRoute({
                    contextKey: "./(stack)/user/settings/info.tsx",
                    route: "info",
                  }),
                  mockRoute({
                    contextKey: "./(stack)/user/settings/[...other].tsx",
                    dynamic: {
                      deep: true,
                      name: "other",
                    },
                    route: "[...other]",
                  }),
                ],
                contextKey: "./(stack)/user/settings.tsx",
                route: "settings",
              }),
            ],
            contextKey: "./(stack)/user.tsx",
            generated: true,
            route: "user",
          }),
        ],
        contextKey: "./(stack).tsx",
        route: "(stack)",
      }),
      mockRoute({
        contextKey: "./another.tsx",
        route: "another",
      }),
      mockRoute({
        children: [
          mockRoute({
            children: [
              mockRoute({
                contextKey: "./some/nested/value.tsx",
                route: "value",
              }),
            ],
            contextKey: "./some/nested.tsx",
            generated: true,
            route: "nested",
          }),
        ],
        contextKey: "./some.tsx",
        generated: true,
        route: "some",
      }),
      ROUTE_DIRECTORY,
      ROUTE_404,
    ]);
  });
  it(`should convert an empty context module to routes`, () => {
    expect(getRoutes(createMockContextModule({}))).toEqual([ROUTE_404]);
  });
});

const mockRoute = (route: Partial<RouteNode>) =>
  ({
    children: [],
    dynamic: null,
    getComponent: expect.any(Function),
    getExtras: expect.any(Function),
    ...route,
  } as unknown as RouteNode);
