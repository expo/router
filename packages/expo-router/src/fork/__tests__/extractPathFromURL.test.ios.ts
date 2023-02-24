import Constants, { ExecutionEnvironment } from "expo-constants";

import { extractExpoPathFromURL } from "../extractPathFromURL";

describe(extractExpoPathFromURL, () => {
  const originalExecutionEnv = Constants.executionEnvironment;

  afterEach(() => {
    Constants.executionEnvironment = originalExecutionEnv;
  });

  test.each<string>([
    "exp://127.0.0.1:19000/",
    "exp://127.0.0.1:19000/--/test/path?query=param",
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
    Constants.executionEnvironment = ExecutionEnvironment.StoreClient;

    const res = extractExpoPathFromURL(url);
    expect(res).toMatchSnapshot();
    // Ensure the Expo Go handling never breaks
    expect(res).not.toMatch(/^--\//);
  });

  it(`only handles Expo Go URLs in Expo Go`, () => {
    Constants.executionEnvironment = ExecutionEnvironment.Bare;

    const res = extractExpoPathFromURL("exp://127.0.0.1:19000/--/test");
    expect(res).toEqual("--/test");
  });
});
