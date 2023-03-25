import { StyleSheet, Text, View } from "@bacons/react-views";
import { createURL } from "expo-linking";
import React from "react";

import { usePathname } from "../LocationProvider";
import Head from "../head/Head";
import { Link } from "../link/Link";
import { useNavigation } from "../useNavigation";

const useLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** Default screen for unmatched routes. */
export function Unmatched() {
  const navigation = useNavigation();
  const pathname = usePathname();
  const url = createURL(pathname);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Not Found",
    });
  }, [navigation]);

  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>

      <View style={styles.container}>
        <Text
          accessibilityRole="header"
          accessibilityLevel={1}
          style={styles.title}
        >
          Unmatched Route
        </Text>
        <Text
          accessibilityRole="header"
          accessibilityLevel={2}
          style={styles.subtitle}
        >
          Page could not be found.{" "}
          <Link href="/" replace style={styles.link}>
            Go back.
          </Link>
        </Text>

        <Link href={pathname} replace style={styles.link}>
          {url}
        </Link>

        <Link href="/_sitemap" replace style={[styles.link, styles.mt8]}>
          Sitemap
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 36,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomColor: "#323232",
    borderBottomWidth: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  link: { color: "rgba(255,255,255,0.4)", textAlign: "center" },
  mt8: { marginTop: 8 },
});
