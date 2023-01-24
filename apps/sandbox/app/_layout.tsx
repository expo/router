import { Head, Link, Navigator, Tabs } from "expo-router";
import { Platform } from "react-native";

import "../theme.css";

export default function Layout() {
  // if (Platform.OS !== "web") {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* og image */}
        <meta property="og:image" content="/og/og-image.jpg" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta property="og:image:type" content="image/jpeg" />
      </Head>
      <Tabs>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="web-lib" />
        <Tabs.Screen name="posts" />
        <Tabs.Screen name="nested/settings" />
        <Tabs.Screen name="nested/[id]" />
      </Tabs>
    </>
  );
  // }
  return (
    <Navigator>
      <Link href="/other">Other</Link>
      <Link href="/">Home</Link>
      <Navigator.Slot />
    </Navigator>
  );
}
