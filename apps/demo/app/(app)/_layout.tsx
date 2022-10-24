import { Tabs } from "expo-router";
export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(second)" />
      <Tabs.Screen name="(first)" />
    </Tabs>
  );
}
