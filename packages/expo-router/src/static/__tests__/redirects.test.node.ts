import { nextRedirect } from "../redirects";

describe(nextRedirect, () => {
  it(`redirects basic`, () => {
    expect(nextRedirect("/", [{ from: "/a", to: "/b" }])).toBe("/");
    expect(nextRedirect("/a", [{ from: "/a", to: "/b" }])).toBe("/b");
  });
  it(`redirects multiple times`, () => {
    expect(
      nextRedirect("/a", [
        { from: "/a", to: "/b" },
        { from: "/b", to: "/c" },
        { from: "/c", to: "/d" },
      ])
    ).toBe("/d");
    expect(
      nextRedirect("/a", [
        { from: "/:slug", to: "/b/:slug" },
        { from: "/b/:slug", to: "/c/:slug" },
      ])
    ).toBe("/c/a");
  });

  it(`redirects with regexp`, () => {
    const redirect = { from: "/:slug(\\d{1,})", to: "/b/:slug" };

    // Matches numbers
    expect(nextRedirect("/123", [redirect])).toBe("/b/123");

    // Doesn't match
    expect(nextRedirect("/abc", [redirect])).toBe("/abc");
  });

  it(`redirects with external URLs`, () => {
    expect(
      nextRedirect("/a", [{ from: "/:slug", to: "https://acme.app" }])
    ).toBe("https://acme.app/");
  });
  it(`redirects with slugs`, () => {
    expect(nextRedirect("/a", [{ from: "/:slug", to: "/b" }])).toBe("/b");
    expect(nextRedirect("/a", [{ from: "/:slug", to: "/b/:slug" }])).toBe(
      "/b/a"
    );
    expect(
      nextRedirect("/a", [
        { from: "/:slug", to: "/b/:slug" },
        { from: "/b/:slug", to: "/c/:slug" },
        { from: "/c/:slug", to: "/d/:slug" },
      ])
    ).toBe("/d/a");
  });

  it(`redirects with has`, () => {
    expect(
      nextRedirect("/a?foo=bar", [
        {
          from: "/:slug",
          to: "/b/:slug",
          has: [
            {
              type: "query",
              key: "foo",
            },
          ],
        },
      ])
    ).toBe("/b/a?foo=bar");
    expect(
      nextRedirect("/a?bar=foo", [
        {
          from: "/:slug",
          to: "/b/:slug",
          has: [
            {
              type: "query",
              key: "foo",
            },
          ],
        },
      ])
    ).toBe("/a?bar=foo");
  });
  it(`redirects with missing`, () => {
    expect(
      nextRedirect("/a?foo=bar", [
        {
          from: "/:slug",
          to: "/b/:slug",
          exclude: [
            {
              type: "query",
              key: "bar",
            },
          ],
        },
      ])
    ).toBe("/b/a?foo=bar");
    expect(
      nextRedirect("/a?foo=bar", [
        {
          from: "/:slug",
          to: "/b/:slug",
          exclude: [
            {
              type: "query",
              key: "foo",
            },
          ],
        },
      ])
    ).toBe("/a?foo=bar");
  });
});
