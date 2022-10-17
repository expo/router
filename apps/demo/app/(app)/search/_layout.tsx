import { Stack, Tabs } from "expo-router";

export default function SearchLayout() {
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <Stack />
    </>
  );
}
