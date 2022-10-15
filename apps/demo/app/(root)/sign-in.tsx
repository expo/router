import { StyleSheet, Text, View } from "react-native";
import { GoogleAuth } from "../../etc/auth/google";

import { Head } from "@bacons/head";

export default function App() {
  const signIn = GoogleAuth.useSignIn();

  return (
    <>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Sign in to the app." />
      </Head>
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Welcome</Text>
        <Text
          style={{ padding: 20, borderWidth: 2, borderColor: "black" }}
          onPress={() => signIn()}
        >
          Sign in
        </Text>
      </View>
    </>
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
