import { Tabs } from "expo-router";

export default function Layout() {
  ////
  requestAnimationFrame(() => {
    // should be broken in SSR
  });
  return <Tabs />;
}
