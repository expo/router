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
