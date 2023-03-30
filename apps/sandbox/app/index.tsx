import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Head from "expo-router/head";

export default function Page() {
  return (
    <View style={styles.container}>
      <Head>
        <title>Home | Expo Router</title>
      </Head>
      <View style={styles.main}>
        <Text style={styles.title}>Welcome</Text>
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
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
