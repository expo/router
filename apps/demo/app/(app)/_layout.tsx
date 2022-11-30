import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(explore)" />
      <Tabs.Screen name="(feed)" />
      <Tabs.Screen name="([user])" />
    </Tabs>
  );
}
