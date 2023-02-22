import {
  getNormalizedStatePath,
  compareUrlSearchParams,
} from "../LocationProvider";

describe(getNormalizedStatePath, () => {
  // Ensure all values are correctly decoded
  it(`returns the normalized path`, () => {
    expect(
      getNormalizedStatePath({
        path: "/foo/bar%20baz?alpha=beta",
        params: {
          alpha: "beta other",
          beta: "gamma",
          charlie: "delta%20echo",
          delta: ["evan", "foxtrot%20gamma", "hotel india"],
        },
      })
    ).toEqual({
      segments: ["foo", "bar baz"],
      params: {
        alpha: "beta other",
        beta: "gamma",
        charlie: "delta echo",
        // Ensure arrays are preserved (rest params).
        delta: ["evan", "foxtrot gamma", "hotel india"],
      },
    });
  });
});

describe(compareUrlSearchParams, () => {
  it("compares search params", () => {
    expect(
      compareUrlSearchParams(
        { one: "two", three: ["four"] },
        { one: "two", three: ["four"] }
      )
    ).toBe(true);

    expect(
      compareUrlSearchParams(
        { one: "two", three: ["four"], five: "six", seven: "eight" },
        { one: "two", three: ["four"], five: "six", seven: "eight" }
      )
    ).toBe(true);

    expect(
      compareUrlSearchParams(
        { six: "seven", eight: ["nine"] },
        { one: "two", three: ["four"] }
      )
    ).toBe(false);
  });
});
