import { treeToReactNavigationLinkingRoutes } from "../getLinkingConfig";

const mockRoutes = [
  {
    children: [
      {
        children: [],
        dynamic: null,
        route: "people",
        contextKey: "./(second-fragment)/people.tsx",
      },
    ],
    dynamic: null,
    route: "(second-fragment)",
    contextKey: "./(second-fragment).tsx",
  },
  {
    children: [
      {
        children: [],
        dynamic: {
          name: "deep",
          deep: true,
        },
        route: "[...deep]",
        contextKey: "./(fragment)/[...deep].tsx",
      },
      {
        children: [],
        dynamic: {
          name: "dynamic",
          deep: false,
        },
        route: "[dynamic]",
        contextKey: "./(fragment)/[dynamic].tsx",
      },
      {
        children: [],
        dynamic: null,
        route: "index",
        contextKey: "./(fragment)/index.tsx",
      },
    ],
    dynamic: null,
    route: "(fragment)",
    contextKey: "./(fragment).tsx",
  },
  {
    children: [
      {
        children: [
          {
            children: [],
            dynamic: {
              name: "screen",
              deep: true,
            },
            route: "[...screen]",
            contextKey: "./other/nested/[...screen].js",
          },
        ],
        dynamic: null,
        route: "nested",
        contextKey: "./other/nested.tsx",
        generated: true,
      },
    ],
    dynamic: null,
    route: "other",
    contextKey: "./other.tsx",
    generated: true,
  },
  {
    children: [],
    dynamic: null,
    route: "__index",
    contextKey: "./__index.tsx",
    generated: true,
    internal: true,
  },
];

describe(treeToReactNavigationLinkingRoutes, () => {
  it("should return a valid linking config", () => {
    expect(
      treeToReactNavigationLinkingRoutes(
        // @ts-expect-error
        mockRoutes
      )
    ).toEqual({
      "(fragment)": {
        path: "",
        screens: { "[...deep]": "*", "[dynamic]": ":dynamic", index: "" },
      },
      "(second-fragment)": { path: "", screens: { people: "people" } },
      __index: "__index",
      other: {
        path: "other",
        screens: {
          nested: { path: "nested", screens: { "[...screen]": "*" } },
        },
      },
    });
  });
});
