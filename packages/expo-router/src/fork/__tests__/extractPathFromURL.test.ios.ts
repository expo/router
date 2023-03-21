import Constants, { ExecutionEnvironment } from "expo-constants";

import { extractExpoPathFromURL } from "../extractPathFromURL";

describe(extractExpoPathFromURL, () => {
  const originalExecutionEnv = Constants.executionEnvironment;

  afterEach(() => {
    Constants.executionEnvironment = originalExecutionEnv;
  });

  for (const [name, exenv] of [
    ["Expo Go", ExecutionEnvironment.StoreClient],
    ["Bare", ExecutionEnvironment.Bare],
  ] as const) {
    describe(name, () => {
      test.each<string>([
        "exp://127.0.0.1:19000/",
        "exp://127.0.0.1:19000/--/test/path?query=param",
        "exp://127.0.0.1:19000/--/test/path?shouldBeEscaped=x%252By%2540xxx.com",
        "exp://127.0.0.1:19000/x?y=x%252By%2540xxx.com",
        "exp://127.0.0.1:19000?query=param",
        "exp://exp.host/@test/test/--/test/path?query=param",
        "exp://exp.host/@test/test/--/test/path",
        "exp://exp.host/@test/test/--/test/path/--/foobar",
        "https://example.com/test/path?query=param",
        "https://example.com/test/path",
        "https://example.com:8000/test/path",
        "https://example.com:8000/test/path+with+plus",
        "https://example.com/test/path?query=do+not+escape",
        "https://example.com/test/path?missingQueryValue=",
        "custom:///?shouldBeEscaped=x%252By%2540xxx.com",
        "custom:///test/path?foo=bar",
        "custom:///",
        "custom://",
        "custom://?hello=bar",
        "invalid",
      ])(`parses %p`, (url) => {
        Constants.executionEnvironment = exenv;

        const res = extractExpoPathFromURL(url);
        expect(res).toMatchSnapshot();

        if (exenv === ExecutionEnvironment.StoreClient) {
          // Ensure the Expo Go handling never breaks
          expect(res).not.toMatch(/^--\//);
        }
      });
    });
  }
  it(`decodes query params`, () => {
    Constants.executionEnvironment = ExecutionEnvironment.Bare;
    expect(extractExpoPathFromURL(`custom:///?x=x%252By%2540xxx.com`)).toEqual(
      "?x=x+y@xxx.com"
    );

    Constants.executionEnvironment = ExecutionEnvironment.StoreClient;
    expect(extractExpoPathFromURL(`custom:///?x=x%252By%2540xxx.com`)).toEqual(
      "?x=x+y@xxx.com"
    );
    expect(
      extractExpoPathFromURL(
        `exp://127.0.0.1:19000/--/test/path?x=x%252By%2540xxx.com`
      )
    ).toEqual("test/path?x=x+y@xxx.com");
    expect(extractExpoPathFromURL(`exp://x?y=x%252By%2540xxx.com`)).toEqual(
      "?y=x+y@xxx.com"
    );
  });

  it(`only handles Expo Go URLs in Expo Go`, () => {
    Constants.executionEnvironment = ExecutionEnvironment.Bare;

    const res = extractExpoPathFromURL("exp://127.0.0.1:19000/--/test");
    // This should look mostly broken, but it's the best we can do
    // when someone uses this format outside of Expo Go.
    expect(res).toEqual("127.0.0.1:19000/--/test");
  });
});
