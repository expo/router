import getStateFromPath from "../getStateFromPath";

it(`supports spaces`, () => {
  expect(
    getStateFromPath("/hello%20world", {
      screens: {
        "hello world": "hello world",
      },
    } as any)
  ).toEqual({
    routes: [
      {
        name: "hello world",
        path: "/hello%20world",
      },
    ],
  });
});

it(`matches unmatched existing groups against 404`, () => {
  expect(
    getStateFromPath("/(app)/(explore)", {
      screens: {
        // Should match 404... maybe
        "[...404]": "*",

        "(app)": {
          path: "(app)",
          screens: {
            "(explore)": {
              path: "(explore)",
              screens: {
                "[user]/index": ":user",
                explore: "explore",
              },
              initialRouteName: "explore",
            },
            "([user])": {
              path: "([user])",
              screens: {
                "[user]/index": ":user",
                explore: "explore",
              },
              initialRouteName: "[user]/index",
            },
          },
        },
      },
    } as any)
  ).toEqual({
    routes: [
      {
        name: "(app)",
        params: { user: "(explore)" },
        state: {
          routes: [
            {
              name: "([user])",
              params: { user: "(explore)" },
              state: {
                routes: [
                  {
                    name: "[user]/index",
                    params: { user: "(explore)" },
                    path: "",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
});

it(`adds dynamic route params from all levels of the path`, () => {
  // A route at `app/[foo]/bar/[baz]/other` should get all of the params from the path.
  expect(
    getStateFromPath("/foo/bar/baz/other", {
      screens: {
        "[foo]": {
          path: ":foo",
          screens: {
            bar: {
              path: "bar",
              screens: {
                "[baz]": {
                  path: ":baz",
                  screens: {
                    other: "other",
                  },
                },
              },
            },
          },
        },
      },
    } as any)
  ).toEqual({
    routes: [
      {
        name: "[foo]",
        params: { baz: "baz", foo: "foo" },
        state: {
          routes: [
            {
              name: "bar",
              params: { baz: "baz", foo: "foo" },
              state: {
                routes: [
                  {
                    name: "[baz]",
                    params: { baz: "baz", foo: "foo" },
                    state: {
                      routes: [
                        {
                          name: "other",
                          params: {
                            baz: "baz",
                            foo: "foo",
                          },
                          path: "/foo/bar/baz/other",
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
});
