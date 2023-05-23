import React, { Text } from "react-native";

import { useRouter, useGlobalSearchParams, router } from "../exports";
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

    expect(await screen.findByText("test-name")).toBeDefined();
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
    }).toThrowError("Navigation state is not ready");
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

    expect(await screen.findByText("test-name")).toBeDefined();
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

    expect(await screen.findByText("test-name")).toBeDefined();

    act(() => {
      router.push("/profile/another-test-name");
    });

    expect(await screen.findByText("another-test-name")).toBeDefined();
  });
});
