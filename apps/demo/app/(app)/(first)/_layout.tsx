import { Stack } from "expo-router";

export const settings = { initialRouteName: "index" };

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
