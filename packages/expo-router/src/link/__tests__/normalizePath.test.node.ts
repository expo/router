import { normalizePath } from "../href";

describe(normalizePath, () => {
  it(`normalize paths`, () => {
    expect(normalizePath("foobar")).toBe("/foobar");
    expect(normalizePath("foobar/")).toBe("/foobar");
    expect(normalizePath("/foobar")).toBe("/foobar");
    expect(normalizePath("/foo/bar")).toBe("/foo/bar");
    expect(normalizePath("/foo/../bar")).toBe("/bar");
    expect(normalizePath("/foo/../../../../bar")).toBe("/bar");
    expect(normalizePath("/foo/../bar/./")).toBe("/bar");
    expect(normalizePath("Tot4lly Wr0n9")).toBe("/Tot4lly Wr0n9");
    expect(normalizePath("Tot4lly/../Wr0n9")).toBe("/Wr0n9");
    expect(normalizePath("Tot4lly/./Wr0n9")).toBe("/Tot4lly/Wr0n9");
  });
});
