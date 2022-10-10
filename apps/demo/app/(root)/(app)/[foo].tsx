import { Link, useLink } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { UrlBar } from "../../../etc/urlBar";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  const link = useLink();
  const nav = useNavigation();

  return (
    <View style={styles.container}>
      <Link href="/" style={{ fontSize: 24, fontWeight: "bold" }}>
        Dismiss
      </Link>
      <Text
        onPress={() => {
          // link.back();
          nav.setParams({ foo: "bar" });
        }}
      >
        Open settings dynamic
      </Text>
      <StatusBar barStyle="light-content" />
      <UrlBar />
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
