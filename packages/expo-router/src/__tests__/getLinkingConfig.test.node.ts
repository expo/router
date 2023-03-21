import { getReactNavigationScreensConfig } from "../getLinkingConfig";

const mockRoutes = [
  {
    children: [
      {
        children: [],
        dynamic: null,
        route: "people",
        contextKey: "./(second-group)/people.tsx",
      },
    ],
    dynamic: null,
    route: "(second-group)",
    contextKey: "./(second-group)/_layout.tsx",
  },
  {
    children: [
      {
        children: [],
        dynamic: [
          {
            name: "deep",
            deep: true,
          },
        ],
        route: "[...deep]",
        contextKey: "./(group)/[...deep].tsx",
      },
      {
        children: [],
        dynamic: [
          {
            name: "dynamic",
            deep: false,
          },
        ],
        route: "[dynamic]",
        contextKey: "./(group)/[dynamic].tsx",
      },
      {
        children: [],
        dynamic: null,
        route: "index",
        contextKey: "./(group)/index.tsx",
      },
    ],
    dynamic: null,
    route: "(group)",
    contextKey: "./(group)/_layout.tsx",
  },
  {
    children: [],
    dynamic: [
      {
        name: "screen",
        deep: true,
      },
    ],
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
      "(group)": {
        initialRouteName: undefined,
        path: "(group)",
        screens: { "[...deep]": "*deep", "[dynamic]": ":dynamic", index: "" },
      },
      "(second-group)": {
        initialRouteName: undefined,
        path: "(second-group)",
        screens: { people: "people" },
      },
      _sitemap: "_sitemap",
      "other/nested/[...screen]": "other/nested/*screen",
    });
  });
});
