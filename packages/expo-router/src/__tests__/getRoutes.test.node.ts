import { RouteNode } from "../Route";
import {
  getRoutes,
  getUserDefinedDeepDynamicRoute,
  getRecursiveTree,
  FileNode,
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
  internal: true,
  route: "[...404]",
};
const ROUTE_DIRECTORY = {
  children: [],
  contextKey: "./__index.tsx",
  dynamic: null,
  generated: true,
  internal: true,
  route: "__index",
};

const asFileNode = (route: Partial<FileNode>): FileNode => ({
  getComponent(): any {
    return function () {
      return null;
    };
  },
  getExtras(): any {
    return {};
  },
  normalizedName: "INVALID_TEST_VALUE",
  contextKey: "INVALID_TEST_VALUE",
  ...route,
});

const asRouteNode = (route: Partial<RouteNode>) => ({
  getComponent(): any {
    return function () {
      return null;
    };
  },
  getExtras(): any {
    return {};
  },
  children: [],
  dynamic: null,
  route: "INVALID_TEST_VALUE",
  contextKey: "INVALID_TEST_VALUE",
  ...route,
});

describe(getRecursiveTree, () => {
  function getTreeForKeys(keys: string[]) {
    const routes = keys.map((normalizedName) =>
      asFileNode({
        normalizedName,
      })
    );
    return getRecursiveTree(routes).children;
  }

  it(`should assert using deprecated layout route format`, () => {
    expect(() => getTreeForKeys(["(app)", "(app)/index"])).toThrowError(
      /Using deprecated Layout Route format/
    );
  });

  it(`should return a layout route`, () => {
    expect(getTreeForKeys(["(app)/_layout", "(app)/index"])).toEqual([
      {
        children: [
          {
            children: [],
            name: "index",
            node: expect.objectContaining({
              normalizedName: "(app)/index",
            }),
            parents: ["", "(app)"],
          },
        ],
        name: "(app)",
        node: expect.objectContaining({
          normalizedName: "(app)/_layout",
        }),
        parents: [""],
      },
    ]);
  });

  it(`should return a layout route using alternative format`, () => {
    expect(getTreeForKeys(["(app)/_layout", "(app)/index"])).toEqual([
      {
        children: [
          {
            children: [],
            name: "index",
            node: expect.objectContaining({
              normalizedName: "(app)/index",
            }),
            parents: ["", "(app)"],
          },
        ],
        name: "(app)",
        node: expect.objectContaining({
          normalizedName: "(app)/_layout",
        }),
        parents: [""],
      },
    ]);
  });
});

describe(getUserDefinedDeepDynamicRoute, () => {
  it(`should return a basic deep dynamic route`, () => {
    const routes = asRouteNode({
      children: [
        asRouteNode({
          route: "[...404]",
        }),
      ],
    });
    expect(getUserDefinedDeepDynamicRoute(routes)).toEqual(routes.children[0]);
  });
  it(`does not return a nested deep dynamic route `, () => {
    const deep = asRouteNode({
      route: "[...404]",
    });
    const routes = asRouteNode({
      children: [
        asRouteNode({
          route: "home",
          children: [deep],
        }),
      ],
    });
    expect(getUserDefinedDeepDynamicRoute(routes)).toEqual(null);
  });
  it(`should return a top-level deep dynamic route when nested in a group`, () => {
    const deep = asRouteNode({
      route: "[...404]",
    });
    const routes = asRouteNode({
      children: [
        asRouteNode({
          route: "(group)",
          children: [
            asRouteNode({
              route: "(another)",
              children: [deep],
            }),
          ],
        }),
      ],
    });
    expect(getUserDefinedDeepDynamicRoute(routes)).toEqual(deep);
  });
  it(`does not return a dynamic route`, () => {
    expect(
      getUserDefinedDeepDynamicRoute(
        asRouteNode({
          children: [
            // [404].js
            asRouteNode({
              route: "[404]",
            }),
          ],
        })
      )
    ).toEqual(null);

    expect(
      getUserDefinedDeepDynamicRoute(
        asRouteNode({
          children: [
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
          ],
        })
      )
    ).toEqual(null);
  });
});

describe(getRoutes, () => {
  it(`should add missing layouts for nested routes`, () => {
    expect(
      dropFunctions(
        getRoutes(
          createMockContextModule({
            "./some/nested/value.tsx": { default() {} },
          })
        )!
      )
    ).toEqual({
      children: [
        {
          children: [],
          contextKey: "./[...404].tsx",
          dynamic: { deep: true, name: "404" },
          generated: true,
          internal: true,
          route: "[...404]",
        },
        {
          children: [],
          contextKey: "./some/nested/value.tsx",
          dynamic: null,
          route: "some/nested/value",
        },
      ],
      contextKey: "./_layout.tsx",
      dynamic: null,
      generated: true,
      route: "",
    });
  });

  it(`get dynamic routes`, () => {
    expect(
      dropFunctions(
        getRoutes(
          createMockContextModule({
            "./[dynamic].tsx": { default() {} },
            "./[...deep].tsx": { default() {} },
          })
        )!
      )
    ).toEqual(
      expect.objectContaining({
        generated: true,
        children: [
          {
            children: [],
            contextKey: "./[dynamic].tsx",
            dynamic: {
              deep: false,
              name: "dynamic",
            },

            route: "[dynamic]",
          },
          {
            children: [],
            contextKey: "./[...deep].tsx",
            dynamic: {
              deep: true,
              name: "deep",
            },

            route: "[...deep]",
          },
          ROUTE_DIRECTORY,
          // No 404 route because we have a dynamic route
        ],
      })
    );
  });

  function dropFunctions({ getComponent, getExtras, ...node }: RouteNode) {
    return {
      ...node,
      children: node.children.map(dropFunctions),
    };
  }

  it(`should convert a complex context module routes`, () => {
    expect(
      dropFunctions(
        getRoutes(
          createMockContextModule({
            "./(stack)/_layout.tsx": { default() {} },
            "./(stack)/home.tsx": { default() {} },
            "./(stack)/settings.tsx": { default() {} },
            "./(stack)/user/(default)/_layout.tsx": { default() {} },
            "./(stack)/user/(default)/posts.tsx": { default() {} },
            "./(stack)/user/profile.tsx": { default() {} },
            "./(stack)/user/[profile].tsx": { default() {} },
            "./(stack)/user/settings/_layout.tsx": { default() {} },
            "./(stack)/user/settings/info.tsx": { default() {} },
            "./(stack)/user/settings/[...other].tsx": { default() {} },
            "./another.tsx": { default() {} },
            "./some/nested/value.tsx": { default() {} },
          })
        )!
      )
    ).toEqual({
      children: [
        {
          children: [
            {
              children: [],
              contextKey: "./(stack)/home.tsx",
              dynamic: null,
              route: "home",
            },
            {
              children: [],
              contextKey: "./(stack)/settings.tsx",
              dynamic: null,
              route: "settings",
            },
            {
              children: [
                {
                  children: [],
                  contextKey: "./(stack)/user/(default)/posts.tsx",
                  dynamic: null,
                  route: "posts",
                },
              ],
              contextKey: "./(stack)/user/(default)/_layout.tsx",
              dynamic: null,
              route: "user/(default)",
            },
            {
              children: [],
              contextKey: "./(stack)/user/profile.tsx",
              dynamic: null,
              route: "user/profile",
            },
            {
              children: [],
              contextKey: "./(stack)/user/[profile].tsx",
              dynamic: null,
              route: "user/[profile]",
            },
            {
              children: [
                {
                  children: [],
                  contextKey: "./(stack)/user/settings/info.tsx",
                  dynamic: null,
                  route: "info",
                },
                {
                  children: [],
                  contextKey: "./(stack)/user/settings/[...other].tsx",
                  dynamic: { deep: true, name: "other" },
                  route: "[...other]",
                },
              ],
              contextKey: "./(stack)/user/settings/_layout.tsx",
              dynamic: null,
              route: "user/settings",
            },
          ],
          contextKey: "./(stack)/_layout.tsx",
          dynamic: null,
          route: "(stack)",
        },
        {
          children: [],
          contextKey: "./another.tsx",
          dynamic: null,
          route: "another",
        },
        {
          children: [],
          contextKey: "./some/nested/value.tsx",
          dynamic: null,
          route: "some/nested/value",
        },
        ROUTE_DIRECTORY,
        ROUTE_404,
      ],
      contextKey: "./_layout.tsx",
      dynamic: null,
      generated: true,
      route: "",
    });
  });
  it(`should convert an empty context module to routes`, () => {
    expect(getRoutes(createMockContextModule({}))).toEqual(null);
  });
});
