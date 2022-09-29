import { Link, useLink, Tabs } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const link = useLink();
  return (
    <View style={styles.container}>
      <Tabs.Screen options={{ title: "Home" }} />
      <Link
        href={"/modal"}
        style={{ fontSize: 24, fontWeight: "bold" }}
      >
        Open Modal
      </Link>
      <Text
        onPress={() => {
          link.push({
            pathname: "/settings/[home]",
            query: { home: "baconbrix" },
          });
        }}
      >
        Open settings dynamic
      </Text>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff000",
    alignItems: "center",
  },
});
