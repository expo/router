import { getReactNavigationScreensConfig } from "../getLinkingConfig";

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
    contextKey: "./(second-fragment)/_layout.tsx",
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
    contextKey: "./(fragment)/_layout.tsx",
  },
  {
    children: [],
    dynamic: {
      name: "screen",
      deep: true,
    },
    route: "other/nested/[...screen]",
    contextKey: "./other/nested/[...screen].js",
  },
  {
    children: [],
    dynamic: null,
    route: "_sitemap",
    contextKey: "./_sitemap.tsx",
    generated: true,
    internal: true,
  },
];

describe(getReactNavigationScreensConfig, () => {
  it("should return a valid linking config", () => {
    expect(
      getReactNavigationScreensConfig(
        // @ts-expect-error
        mockRoutes
      )
    ).toEqual({
      "(fragment)": {
        initialRouteName: undefined,
        path: "(fragment)",
        screens: { "[...deep]": "*", "[dynamic]": ":dynamic", index: "" },
      },
      "(second-fragment)": {
        initialRouteName: undefined,
        path: "(second-fragment)",
        screens: { people: "people" },
      },
      _sitemap: "_sitemap",
      "other/nested/[...screen]": "other/nested/*",
    });
  });
});
