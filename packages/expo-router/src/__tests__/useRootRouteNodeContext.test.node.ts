import { assertDuplicateRoutes } from "../useRootRouteNodeContext";

describe(assertDuplicateRoutes, () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });
  it(`throws if there are duplicate routes`, () => {
    expect(() =>
      assertDuplicateRoutes(["a.js", "a.tsx", "b.js"])
    ).toThrowErrorMatchingInlineSnapshot(
      `"Multiple files match the route name \\"a\\"."`
    );
  });

  it(`doesn't throw if there are no duplicate routes`, () => {
    expect(() =>
      assertDuplicateRoutes(["a", "b", "/c/d/e.js", "f/g.tsx"])
    ).not.toThrow();
  });

  it(`doesn't throw if running in production`, () => {
    process.env.NODE_ENV = "production";
    expect(() => assertDuplicateRoutes(["a", "a.js"])).not.toThrow();
  });
});
