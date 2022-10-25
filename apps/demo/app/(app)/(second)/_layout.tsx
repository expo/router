import { Stack } from "expo-router";

export const settings = { initialRouteName: "second" };

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="second" />
    </Stack>
  );
}
