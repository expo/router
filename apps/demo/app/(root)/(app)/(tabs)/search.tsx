import { NativeStack, Tabs } from "expo-router";

export default function Search() {
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <NativeStack />
    </>
  );
}
