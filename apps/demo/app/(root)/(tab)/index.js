import { Link, NativeStack, Tabs } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <Tabs.Screen options={{ title: "Home" }} />
      <Link href="/modal" style={{ fontSize: 24, fontWeight: "bold" }}>
        Open Modal
      </Link>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
