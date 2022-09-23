import { treeToReactNavigationLinkingRoutes } from "../getLinkingConfig";

const mockRoutes = [
  {
    screenName: "(second-fragment)",
    children: [
      {
        screenName: "people",
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
    screenName: "(fragment)",
    children: [
      {
        screenName: "deep",
        children: [],
        dynamic: {
          name: "deep",
          deep: true,
        },
        route: "[...deep]",
        contextKey: "./(fragment)/[...deep].tsx",
      },
      {
        screenName: "dynamic",
        children: [],
        dynamic: {
          name: "dynamic",
          deep: false,
        },
        route: "[dynamic]",
        contextKey: "./(fragment)/[dynamic].tsx",
      },
      {
        screenName: "index",
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
    screenName: "other",
    children: [
      {
        screenName: "nested",
        children: [
          {
            screenName: "screen",
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
    screenName: "__index",
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
    // @ts-expect-error
    expect(treeToReactNavigationLinkingRoutes(mockRoutes)).toEqual({
      "(second-fragment)": {
        path: "",
        screens: {
          people: { path: "people" },
        },
      },
      "(fragment)": {
        path: "",
        screens: {
          deep: { path: "*" },
          dynamic: { path: ":dynamic" },
          index: { path: "" },
        },
      },
      other: {
        path: "other",
        screens: {
          nested: {
            path: "nested",
            screens: { screen: { path: "*" } },
          },
        },
      },
      __index: { path: "__index" },
    });
  });
});
