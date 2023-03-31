import { renderRouter, screen } from "expo-router/testing-library";
import { Text } from "react-native";

test.skip("examples of some things", async () => {
  renderRouter();

  screen.debug();

  expect(1).toBeTruthy();
});

test("examples of some things", async () => {
  renderRouter({
    "(app)/index": () => {
      return <Text>Test</Text>;
    },
    asdf: {
      default: () => {
        return <Text>Test</Text>;
      },
    },
  });

  screen.debug();

  expect(1).toBeTruthy();
});
