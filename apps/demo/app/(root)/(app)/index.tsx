import { StyleSheet, Text, View } from "react-native";
import { GoogleAuth } from "../../../etc/auth/google";
import { Link } from "expo-router";

export default function App() {
  const signOut = GoogleAuth.useSignOut();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Welcome</Text>
      <Text
        style={{ padding: 20, borderWidth: 2, borderColor: "black" }}
        onPress={() => signOut()}
      >
        Sign out
      </Text>

      <Link
        style={{ marginTop: 20, padding: 20, borderWidth: 2, borderColor: "black" }}
        href={"/test"}
      >
        GoTo Foo
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
