import { configFromFs } from "../mockState";

describe(configFromFs, () => {
  it(`matches`, () => {
    expect(
      configFromFs([
        "(foo)/_layout.tsx",
        "(foo)/bar/_layout.tsx",
        "(foo)/bar/[id].tsx",
        "(foo)/bar/[...rest].tsx",
      ])
    ).toEqual({
      initialRouteName: undefined,
      screens: {
        "(foo)": {
          initialRouteName: undefined,
          path: "(foo)",
          screens: {
            bar: {
              initialRouteName: undefined,
              path: "bar",
              screens: { "[...rest]": "*rest", "[id]": ":id" },
            },
          },
        },
        "[...404]": "*404",
        _sitemap: "_sitemap",
      },
    });
  });
});
