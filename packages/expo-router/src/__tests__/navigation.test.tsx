import React, { Text } from "react-native";

import {
  useRouter,
  useGlobalSearchParams,
  router,
  useLocalSearchParams,
  Redirect,
} from "../exports";
import { Stack } from "../layouts/Stack";
import { Tabs } from "../layouts/Tabs";
import { act, fireEvent, renderRouter, screen } from "../testing-library";

describe("hooks only", () => {
  it("can handle navigation between routes", async () => {
    renderRouter({
      index: function MyIndexRoute() {
        const router = useRouter();

        return (
          <Text
            testID="index"
            onPress={() => router.push("/profile/test-name")}
          >
            Press me
          </Text>
        );
      },
      "/profile/[name]": function MyRoute() {
        const { name } = useGlobalSearchParams();
        return <Text>{name}</Text>;
      },
    });

    const text = await screen.findByTestId("index");

    act(() => {
      fireEvent.press(text);
    });

    expect(await screen.findByText("test-name")).toBeOnTheScreen();
    expect(screen).toHavePathname("/profile/test-name");
  });
});

describe("imperative only", () => {
  it("will throw if navigation is attempted before navigation is ready", async () => {
    renderRouter(
      {
        index: function MyIndexRoute() {
          return <Text>Press me</Text>;
        },
        "/profile/[name]": function MyRoute() {
          const { name } = useGlobalSearchParams();
          return <Text>{name}</Text>;
        },
      },
      {
        initialUrl: new Promise(() => {}), // This never resolves
      }
    );

    expect(() => {
      act(() => {
        router.push("/profile/test-name");
      });
    }).toThrowError(
      "Attempted to navigate before mounting the Root Layout component. Ensure the Root Layout component is rendering a Slot, or other navigator on the first render."
    );
  });

  it("can handle navigation between routes", async () => {
    renderRouter({
      index: function MyIndexRoute() {
        return <Text testID="index">Press me</Text>;
      },
      "/profile/[name]": function MyRoute() {
        const { name } = useGlobalSearchParams();
        return <Text>{name}</Text>;
      },
    });

    await screen.findByTestId("index");

    act(() => {
      router.push("/profile/test-name");
    });

    expect(await screen.findByText("test-name")).toBeOnTheScreen();
  });
  it("can handle navigation between routes with hashes", async () => {
    renderRouter({
      index: function MyIndexRoute() {
        return <Text testID="index">Press me</Text>;
      },
      "/profile/[name]": function MyRoute() {
        const { name } = useGlobalSearchParams();
        return <Text>{name}</Text>;
      },
    });

    await screen.findByTestId("index");

    act(() => {
      router.push("/profile/test-name?foo=bar#baz");
    });

    expect(await screen.findByText("test-name")).toBeOnTheScreen();
  });
});

describe("mixed navigation", () => {
  it("can handle mixed navigation between routes", async () => {
    renderRouter({
      index: function MyIndexRoute() {
        const router = useRouter();

        return (
          <Text
            testID="index"
            onPress={() => router.push("/profile/test-name")}
          >
            Press me
          </Text>
        );
      },
      "/profile/[name]": function MyRoute() {
        const { name } = useGlobalSearchParams();
        return <Text>{name}</Text>;
      },
    });

    const text = await screen.findByTestId("index");

    act(() => {
      fireEvent.press(text);
    });

    expect(await screen.findByText("test-name")).toBeOnTheScreen();

    act(() => {
      router.push("/profile/another-test-name");
    });

    expect(await screen.findByText("another-test-name")).toBeOnTheScreen();
  });
});

it("preserves history when replacing screens within the same navigator", () => {
  /* Modified repro of [#221](https://github.com/expo/router/issues/221). */

  renderRouter({
    index: () => <Text>home</Text>,
    two: () => <Text>two</Text>,
    permissions: () => <Text>permissions</Text>,
    protected: function Protected() {
      const params = useLocalSearchParams();

      if (!params.permissions) {
        return <Redirect href="/permissions" />;
      }

      return <Text>protexted</Text>;
    },
  });

  expect(screen).toHavePathname("/");

  act(() => router.push("/two"));
  expect(screen).toHavePathname("/two");

  act(() => router.push("/protected"));
  // /protected should have a redirect that replaces the pathname
  expect(screen).toHavePathname("/permissions");

  act(() => router.back());
  expect(screen).toHavePathname("/two");

  // Can also replace via the imperative API
  act(() => router.replace("/permissions"));
  expect(screen).toHavePathname("/permissions");

  act(() => router.back());
  expect(screen).toHavePathname("/");
});

it("replaces from top level modal to initial route in a tab navigator", () => {
  /* Modified repro of [#221](https://github.com/expo/router/issues/221). */

  renderRouter({
    _layout: {
      unstable_settings: {
        // Ensure that reloading on `/modal` keeps a back button present.
        initialRouteName: "(tabs)",
      },
      default: () => <Stack />,
    },
    "[...missing]": () => <Text>missing</Text>,
    "(tabs)/_layout": () => <Tabs />,
    "(tabs)/index": () => <Text>two</Text>,
  });

  expect(screen).toHavePathname("/");
  expect(screen).toHaveSegments(["(tabs)"]);

  act(() => router.push("/missing-screen"));
  expect(screen).toHavePathname("/missing-screen");
  expect(screen).toHaveSegments(["[...missing]"]);
  act(() => router.push("/"));
  // /protected should have a redirect that replaces the pathname
  expect(screen).toHavePathname("/");
  expect(screen).toHaveSegments(["(tabs)"]);
});
