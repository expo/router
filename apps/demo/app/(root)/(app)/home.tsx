import { Stack, Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <Stack />
    </>
  );
}
