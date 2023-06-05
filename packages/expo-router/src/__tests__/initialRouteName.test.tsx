import React from "react";
import { Text } from "react-native";
import Stack from "../layouts/Stack";
import { renderRouter, screen } from "../testing-library";

/**
 * initialRouteName sets the "default" screen for a navigator, with the functionality changing per navigator
 */

describe("initialRouteName - stacks", () => {
  it("will render 'a', but have the initialRoute in history ", async () => {
    renderRouter(
      {
        _layout: {
          unstable_settings: { initialRouteName: "index" },
          default: () => <Stack />,
        },
        index: () => <Text>Screen: index</Text>,
        a: () => <Text onPress={() => navigator.goBack()}>Screen: a</Text>,
      },
      {
        initialUrl: "/a",
      }
    );

    expect(await screen.findByText("Screen: a")).toBeDefined();
    expect(await screen.findByText("Screen: a")).toBeDefined();
  });
});
