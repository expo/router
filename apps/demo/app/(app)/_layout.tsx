import { Tabs } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(second)",
  template: (node) => {
    return [node];
  },
};

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(first)" />
      <Tabs.Screen name="(second)" options={{}} />
      <Tabs.Screen name="(third)" />
    </Tabs>
  );
}
