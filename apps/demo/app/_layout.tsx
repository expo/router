import { Stack, Tabs } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" redirect />
      <Stack.Screen name="(layout)" />
    </Stack>
  );
}
