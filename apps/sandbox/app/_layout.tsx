import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="blog/[post]"
        options={{ href: "/blog/welcome-to-the-universe" }}
      />
    </Tabs>
  );
}
