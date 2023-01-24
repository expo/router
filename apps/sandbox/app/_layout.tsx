import { Link, Navigator, Tabs } from "expo-router";
import { Platform } from "react-native";

import "../theme.css";

export default function Layout() {
  // if (Platform.OS !== "web") {
  return <Tabs />;
  // }
  return (
    <Navigator>
      <Link href="/other">Other</Link>
      <Link href="/">Home</Link>
      <Navigator.Slot />
    </Navigator>
  );
}
