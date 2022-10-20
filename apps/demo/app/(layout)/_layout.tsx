import { Stack, Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "First" }} />
      <Tabs.Screen name="second" options={{ title: "Second" }} />
      <Tabs.Screen name="[user]" options={{ title: "Me", href: "/bacon" }} />
    </Tabs>
  );
  //   return <Stack />;
}
