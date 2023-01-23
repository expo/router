import { Head } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  return (
    <>
      <Head>
        <title>Home (title)</title>
        <meta
          name="description"
          content="This is the first page of your app."
        />
      </Head>

      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.mainTitle}>Hello World</Text>
          <Text
            style={styles.subtitle}
            onPress={async () => {
              const data = await fetch("/endpoint").then((v) => v.text());
              console.log(data);
              alert(JSON.stringify(data, null, 2));
            }}
          >
            GET: /endpoint
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    color: "#38434D",
  },
});
