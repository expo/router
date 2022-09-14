import { treeToReactNavigationLinkingRoutes } from "../getRoutes";

const mockRoutes = [
  {
    route: "(stack)",
    extras: {},
    contextKey: "./(stack).tsx",
    children: [
      {
        route: "(tab)",
        extras: {},
        contextKey: "./(stack)/(tab).tsx",
        children: [
          {
            route: "index",
            extras: {},
            contextKey: "./(stack)/(tab)/index.tsx",
            children: [],
            dynamic: false,
          },
          {
            route: "more",
            extras: {},
            contextKey: "./(stack)/(tab)/more.tsx",
            children: [],
            dynamic: false,
          },
          {
            route: "profile",
            extras: {},
            contextKey: "./(stack)/(tab)/profile.tsx",
            children: [
              {
                route: "index",
                extras: {},
                contextKey: "./(stack)/(tab)/profile/index.tsx",
                children: [],
                dynamic: false,
              },
              {
                route: "reels",
                extras: {},
                contextKey: "./(stack)/(tab)/profile/reels.tsx",
                children: [],
                dynamic: false,
              },
            ],
            dynamic: false,
          },
          {
            route: "[...most]",
            extras: {},
            contextKey: "./(stack)/(tab)/[...most].tsx",
            children: [],
            dynamic: true,
          },
          {
            route: "[[...all]]",
            extras: {},
            contextKey: "./(stack)/(tab)/[[...all]].tsx",
            children: [],
            dynamic: true,
          },
          {
            route: "[many]",
            extras: {},
            contextKey: "./(stack)/(tab)/[many].tsx",
            children: [],
            dynamic: true,
          },
        ],
        dynamic: false,
      },
      {
        route: "modal",
        extras: {},
        contextKey: "./(stack)/modal.tsx",
        children: [],
        dynamic: false,
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
          "(tab)": {
            path: "",
            screens: {
              ":...most": ":...most",
              ":[...all]": ":[...all]",
              ":many": ":many",
              index: "",
              more: "more",
              profile: {
                path: "profile",
                screens: {
                  index: "",
                  reels: "reels",
                },
              },
            },
          },
          modal: "modal",
        },
      },
    });
  });
});
