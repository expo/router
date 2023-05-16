import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  const { user } = useLocalSearchParams();
  return (
    <>
      {user === "bacon" && (
        <Text style={{ position: "absolute", top: 8, left: 8 }}>
          This is the default page
        </Text>
      )}
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.title}>User: {user}</Text>

          <Link href="/(user)/mark">Go to Mark</Link>
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
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
