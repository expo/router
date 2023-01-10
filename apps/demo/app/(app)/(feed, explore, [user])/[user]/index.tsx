import { useSearchParams } from "expo-router";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  const params = useSearchParams();
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>User: {params.get("user")}</Text>

        <Link href="/([user])/compose">User {"->"} Compose</Link>
        <Link href="./compose">Local {"->"} Compose</Link>
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
