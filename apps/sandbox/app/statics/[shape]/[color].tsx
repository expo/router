import { Link, useSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Head from "expo-router/head";

export function generateStaticParams({
  params,
}: {
  params: {
    // Parent params
    shape: string;
  };
}) {
  return ["red", "blue"].map((color) => ({
    ...params,
    color,
  }));
}

export default function Page() {
  const params = useSearchParams();
  return (
    <View style={styles.container}>
      <Head>
        <title>
          Statics: {params.color} + {params.shape}
        </title>
      </Head>
      <View style={styles.main}>
        <Text style={styles.title}>Statics vvv</Text>
        <Link href="/" style={styles.subtitle}>
          Static page: {JSON.stringify(params)}
        </Link>
      </View>
    </View>
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
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
