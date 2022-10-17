import { StyleSheet, Text, View } from "react-native";
import { GoogleAuth } from "../../../etc/auth/google";
import { UrlBar } from "../../../etc/urlBar";

export { ErrorBoundary } from "expo-router";
export default function App({ route }) {
  const signOut = GoogleAuth.useSignOut();
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>
        Welcome @{route.params?.user || "ERR"}
      </Text>
      <Text
        style={{ padding: 20, borderWidth: 2, borderColor: "black" }}
        onPress={() => signOut()}
      >
        Sign out
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
