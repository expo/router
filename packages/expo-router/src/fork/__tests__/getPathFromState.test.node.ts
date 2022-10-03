import getPathFromState from "../getPathFromState";

describe(getPathFromState, () => {
  it(`should parse initial nested screen that doesn't have a state object`, () => {
    // Happens when moving to a path in a nested stack navigator for the first time.
    expect(
      getPathFromState({
        stale: false,
        type: "stack",
        key: "stack-SJm8YPL1n7zMtnG4BzUL4",
        index: 0,
        routeNames: ["index", "me", "search", "new-story"],
        routes: [
          {
            name: "me",
            params: {
              initial: true,
              screen: "lists",
              params: {},
              path: "/me/lists",
            },
            key: "me-NpM3lwFg-itsR-Jx2JSQD",
          },
        ],
      })
    ).toEqual("/me/lists");

    // This is the subsequent state object after the initial state object.
    expect(
      getPathFromState({
        stale: false,
        type: "stack",
        key: "stack-SJm8YPL1n7zMtnG4BzUL4",
        index: 0,
        routeNames: ["index", "me", "search", "new-story"],
        routes: [
          {
            name: "me",
            params: {
              initial: true,
              screen: "lists",
              params: {},
              path: "/me/lists",
            },
            state: {
              stale: false,
              type: "stack",
              key: "stack-TkmK3B221tH45uOx5PyDh",
              index: 0,
              routeNames: ["index", "lists", "stories", "notifications"],
              routes: [
                {
                  key: "lists-WCKjVlbNWi9e9NSfQj-N7",
                  name: "lists",
                  params: {},
                  path: "/me/lists",
                },
              ],
            },
            key: "me-NpM3lwFg-itsR-Jx2JSQD",
          },
        ],
      })
    ).toEqual("/me/lists");
  });
});
