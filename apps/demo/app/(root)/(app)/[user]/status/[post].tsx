import { StyleSheet, Text, View } from "react-native";
import { UrlBar } from "../../../../../etc/urlBar";

export { ErrorBoundary } from "expo-router";

export default function Post({ route }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>
        Post @{route.params.user} - {route.params.post}
      </Text>

      <UrlBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
