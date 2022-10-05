import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { GoogleAuth } from "../../../etc/auth/google";
import { UrlBar } from "../../../etc/urlBar";

export default function App() {
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
        Secondary
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
