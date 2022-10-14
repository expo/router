import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }} onPress={() => {}}>
        Welcome
      </Text>
      <Link href="/baconbrix/status/111" style={{ fontSize: 24 }}>
        Go to post
      </Link>
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
