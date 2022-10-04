import { Head } from "expo-head";
import { StyleSheet, Text, View } from "react-native";
import { GoogleAuth } from "../../../../etc/auth/google";

export default function App() {
  const signOut = GoogleAuth.useSignOut();

  return (
    <>
      <Head>
        <title>Home | Bacon App 🥓</title>
        <meta name="description" content="Come rate and review Bacon" />
        <meta name="keywords" content="bacon,food,app" />
      </Head>
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Welcome</Text>
        <Text
          style={{ padding: 20, borderWidth: 2, borderColor: "black" }}
          onPress={() => signOut()}
        >
          Sign out
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
