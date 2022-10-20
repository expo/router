import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      defaultScreenOptions={{
        lazy: true,
      }}
      screenOptions={{
        lazy: true,
      }}
    ></Tabs>
  );
}
