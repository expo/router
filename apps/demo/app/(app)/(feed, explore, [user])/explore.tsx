import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  const users = ["lydiahallie", "evanbacon", "cedricvanputten"];
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Explore</Text>

        <Link href="./feed">Compose</Link>

        {users.map((user) => (
          <Link key={user} href={{ params: { user }, pathname: "./[user]" }}>
            Visit @{user}
          </Link>
        ))}
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
