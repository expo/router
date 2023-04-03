import React from "react";
import { Text } from "react-native";

import { act, fireEvent, renderRouter, screen } from "..";
import { useSearchParams, useRouter } from "../../exports";

describe(renderRouter, () => {
  it("can render a route", async () => {
    renderRouter({
      index: () => <Text>Hello</Text>,
    });

    expect(await screen.findByText("Hello")).toBeDefined();
  });

  it("can handle dynamic routes", async () => {
    renderRouter(
      {
        "[slug]": function Path() {
          const { slug } = useSearchParams();
          return <Text>{slug}</Text>;
        },
      },
      {
        initialUrl: "/test-path",
      }
    );

    expect(await screen.findByText("test-path")).toBeDefined();

    expect(screen).toHavePathname("/[slug]");
    expect(screen).toHaveSearchParams({
      slug: "test-path",
    });
  });

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
        const { name } = useSearchParams();
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
