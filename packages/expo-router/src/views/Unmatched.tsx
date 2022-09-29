import { StyleSheet, Text, View } from "@bacons/react-views";
import { createURL } from "expo-linking";
import React, { forwardRef } from "react";

import { Link } from "../link/Link";

/** Default screen for unmatched routes. */
export const Unmatched = forwardRef((props, ref) => {
  const url = createURL("");
  return (
    // @ts-ignore
    <View ref={ref} style={styles.container}>
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
        <Link href="/" style={styles.link}>
          Go back.
        </Link>
      </Text>

      <Link href="/" style={styles.link}>
        {url}
      </Link>

      {process.env.NODE_ENV === "development" && (
        <Link href="/__index" style={styles.link}>
          Sitemap
        </Link>
      )}
    </View>
  );
});

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
});
