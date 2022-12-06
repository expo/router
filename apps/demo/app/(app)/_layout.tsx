import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(feed)" options={{ title: "Home" }} />
      <Tabs.Screen name="(explore)" options={{ title: "Search" }} />
      <Tabs.Screen name="([user])" options={{ title: "Profile" }} />
    </Tabs>
  );
}
