import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="(index)"
        options={{
          title: "About",
        }}
      />
      <Tabs.Screen
        name="(posts)"
        options={{
          title: "Posts",
        }}
      />
      <Tabs.Screen
        name="(photos)"
        options={{
          title: "Photos",
        }}
      />
    </Tabs>
  );
}
