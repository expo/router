import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { GoogleAuth } from "../../../etc/auth/google";
import { UrlBar } from "../../../etc/urlBar";

export default function App() {
  const signIn = GoogleAuth.useSignOut();

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontWeight: "bold",
          color: "white",
          marginBottom: 24,
          fontSize: 64,
        }}
      >
        Hello, Evan
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 24,
          padding: 16,
          paddingHorizontal: 48,
          borderWidth: 2,
          borderColor: "white",
        }}
        onPress={() => signIn()}
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
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
