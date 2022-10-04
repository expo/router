import { Head } from "expo-head/build/ExpoHead.ios";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <>
      <Head>
        <title>Beta | Bacon App 🥓</title>
        <meta name="description" content="Do beta stuff" />
        <meta name="keywords" content="bacon,food,app" />
        <meta
          property="og:image"
          content={"https://icogen.vercel.app/api/icon?color=white&icon=1f953"}
        />
        <meta
          property="og:image"
          media="(prefers-color-scheme: dark)"
          content={"https://icogen.vercel.app/api/icon?color=black&icon=1f953"}
        />
      </Head>
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Bet!a</Text>
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
