import { renderRouter, screen } from "expo-router/testing-library";
import { Text, View } from "react-native";

test("examples of some things", async () => {
  renderRouter();

  const text = await screen.findByText("Sign Out");

  expect(text).toBeTruthy();
});

test("examples of some things", async () => {
  renderRouter({
    index: () => {
      return (
        <View>
          <Text>Test</Text>
        </View>
      );
    },
  });

  screen.debug();
  const text = await screen.findByText("Test");

  expect(text).toBeTruthy();
});
