import { treeToReactNavigationLinkingRoutes } from "../getRoutes";

const mockRoutes = [
  {
    route: "(stack)",
    extras: {},
    contextKey: "./(stack).tsx",
    children: [
      {
        route: "index",
        extras: {},
        contextKey: "./(stack)/index.tsx",
        children: [],
        dynamic: false,
      },
      {
        route: "[...most]",
        extras: {},
        contextKey: "./(stack)/[...most].tsx",
        children: [],
        dynamic: true,
      },
      {
        route: "[[...all]]",
        extras: {},
        contextKey: "./(stack)/[[...all]].tsx",
        children: [],
        dynamic: true,
      },
      {
        route: "[many]",
        extras: {},
        contextKey: "./(stack)/[many].tsx",
        children: [],
        dynamic: true,
      },
    ],
    dynamic: false,
  },
];

describe(treeToReactNavigationLinkingRoutes, () => {
  it("should return a valid linking config", () => {
    // @ts-expect-error
    expect(treeToReactNavigationLinkingRoutes(mockRoutes)).toEqual({
      "(stack)": {
        path: "",
        screens: {
          all: "*",
          many: ":many",
          index: "",
          most: "*",
        },
      },
    });
  });
});
