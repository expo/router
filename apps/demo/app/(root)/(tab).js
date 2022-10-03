import { Tabs } from "expo-router";
export default function Layout1() {
  return (
    <Tabs initialRouteName={"index"}>
      <Tabs.Screen name="settings" options={{ title: "Settings", headerShown: false }} />
    </Tabs>
  );
}
