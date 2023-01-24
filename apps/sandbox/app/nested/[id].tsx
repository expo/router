import { Head, useSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          id: "static-1",
        },
      },
      {
        params: {
          id: "static-2",
        },
      },
    ],
    //   fallback: true, false or "blocking" // See the "fallback" section below
  };
}

export default function Page() {
  const { id } = useSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Post: {id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    color: "#38434D",
  },
});
