import { Tabs } from "expo-router";

export const settings = { initialRouteName: "(second)" };

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(first)" />
      <Tabs.Screen name="(second)" options={{}} />
    </Tabs>
  );
}
