import {
  getRoutes,
  createRouteNode,
  getUserDefinedDeepDynamicRoute,
  recurseAndAddMissingNavigators,
} from "../getRoutes";
import { RouteNode } from "../Route";
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
  screenName: "404",
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
  screenName: "__index",
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

describe(recurseAndAddMissingNavigators, () => {
  it(`should add a navigator to a route with children`, () => {
    const routes = [
      asRouteNode({
        // @ts-expect-error
        contextKey: null,
        route: "home",
        children: [
          asRouteNode({
            // @ts-expect-error
            contextKey: null,
            route: "user",
            children: [
              asRouteNode({
                route: "user",
                contextKey: "./home/user.tsx",
              }),
            ],
          }),
        ],
      }),
    ];
    expect(recurseAndAddMissingNavigators(routes, [])).toEqual([
      {
        children: [
          {
            children: [
              {
                children: [],
                contextKey: "./home/user.tsx",
                dynamic: null,
                getComponent: expect.any(Function),
                getExtras: expect.any(Function),
                route: "user",
                screenName: "user",
              },
            ],
            generated: true,
            contextKey: "./home/user.tsx",
            dynamic: null,
            getComponent: expect.any(Function),
            getExtras: expect.any(Function),
            route: "user",
            screenName: "user",
          },
        ],
        contextKey: "./home.tsx",
        dynamic: null,
        generated: true,
        getComponent: expect.any(Function),
        getExtras: expect.any(Function),
        route: "home",
        screenName: "home",
      },
    ]);
  });
});

describe(getRoutes, () => {
  it(`should add missing layouts for nested routes`, () => {
    expect(
      getRoutes(
        createMockContextModule({
          "./some/nested/value.tsx": { default: function () {} },
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
                screenName: "value",
              },
            ],
            contextKey: "./some/nested.tsx",
            dynamic: null,
            generated: true,
            getComponent: expect.any(Function),
            getExtras: expect.any(Function),
            route: "nested",
            screenName: "nested",
          },
        ],
        contextKey: "./some.tsx",
        dynamic: null,
        generated: true,
        getComponent: expect.any(Function),
        getExtras: expect.any(Function),
        route: "some",
        screenName: "some",
      },
      ROUTE_DIRECTORY,
      ROUTE_404,
    ]);
  });

  it(`get dynamic routes`, () => {
    expect(
      getRoutes(
        createMockContextModule({
          "./[dynamic].tsx": { default: function () {} },
          "./[...deep].tsx": { default: function () {} },
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
        screenName: "dynamic",
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
        screenName: "deep",
      },
      ROUTE_DIRECTORY,
      // No 404 route because we have a dynamic route
    ]);
  });

  it(`should convert a complex context module routes`, () => {
    expect(
      getRoutes(
        createMockContextModule({
          "./(stack).tsx": { default: function () {} },
          "./(stack)/home.tsx": { default: function () {} },
          "./(stack)/settings.tsx": { default: function () {} },
          "./(stack)/user/(default)/posts.tsx": { default: function () {} },
          "./(stack)/user/(default).tsx": { default: function () {} },
          "./(stack)/user/profile.tsx": { default: function () {} },
          "./(stack)/user/[profile].tsx": { default: function () {} },
          "./(stack)/user/settings.tsx": { default: function () {} },
          "./(stack)/user/settings/info.tsx": { default: function () {} },
          "./(stack)/user/settings/[...other].tsx": { default: function () {} },
          "./another.tsx": { default: function () {} },
          "./some/nested/value.tsx": { default: function () {} },
        })
      )
    ).toEqual([
      mockRoute({
        children: [
          mockRoute({
            contextKey: "./(stack)/home.tsx",
            route: "home",
            screenName: "home",
          }),
          mockRoute({
            contextKey: "./(stack)/settings.tsx",
            route: "settings",
            screenName: "settings",
          }),
          mockRoute({
            children: [
              mockRoute({
                children: [
                  mockRoute({
                    contextKey: "./(stack)/user/(default)/posts.tsx",
                    route: "posts",
                    screenName: "posts",
                  }),
                ],
                contextKey: "./(stack)/user/(default).tsx",
                route: "(default)",
                screenName: "(default)",
              }),
              mockRoute({
                contextKey: "./(stack)/user/profile.tsx",
                route: "profile",
                screenName: "profile",
              }),
              mockRoute({
                contextKey: "./(stack)/user/[profile].tsx",
                dynamic: {
                  deep: false,
                  name: "profile",
                },
                route: "[profile]",
                screenName: "profile",
              }),
              mockRoute({
                children: [
                  mockRoute({
                    contextKey: "./(stack)/user/settings/info.tsx",
                    route: "info",
                    screenName: "info",
                  }),
                  mockRoute({
                    contextKey: "./(stack)/user/settings/[...other].tsx",
                    dynamic: {
                      deep: true,
                      name: "other",
                    },
                    route: "[...other]",
                    screenName: "other",
                  }),
                ],
                contextKey: "./(stack)/user/settings.tsx",
                route: "settings",
                screenName: "settings",
              }),
            ],
            contextKey: "./(stack)/user.tsx",
            generated: true,
            route: "user",
            screenName: "user",
          }),
        ],
        contextKey: "./(stack).tsx",
        route: "(stack)",
        screenName: "(stack)",
      }),
      mockRoute({
        contextKey: "./another.tsx",
        route: "another",
        screenName: "another",
      }),
      mockRoute({
        children: [
          mockRoute({
            children: [
              mockRoute({
                contextKey: "./some/nested/value.tsx",
                route: "value",
                screenName: "value",
              }),
            ],
            contextKey: "./some/nested.tsx",
            generated: true,
            route: "nested",
            screenName: "nested",
          }),
        ],
        contextKey: "./some.tsx",
        generated: true,
        route: "some",
        screenName: "some",
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
