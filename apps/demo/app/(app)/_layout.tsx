import { Tabs } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(home)",
};

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(home)" options={{ title: "Home" }} />
      <Tabs.Screen name="(search)" options={{ title: "Search" }} />
      <Tabs.Screen
        name="(profile)"
        options={{ title: "Profile", href: "/baconbrix" }}
      />
    </Tabs>
  );
}
