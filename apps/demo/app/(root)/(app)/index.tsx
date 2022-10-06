import { StyleSheet, Text, View } from "react-native";
import { GoogleAuth } from "../../../etc/auth/google";
import {Link, useLink} from "expo-router";

export default function App() {
  const signOut = GoogleAuth.useSignOut();
  const link = useLink();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Welcome</Text>
      <Text
        style={{ padding: 20, borderWidth: 2, borderColor: "black" }}
        onPress={() => signOut()}
      >
        Sign out
      </Text>

      <Text
        style={{ marginTop: 20, padding: 20, borderWidth: 2, borderColor: "black" }}
        /*href={"/test"}*/
        onPress={() => link.replace('/test/ololo')}
      >
        GoTo Foo
      </Text>
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
