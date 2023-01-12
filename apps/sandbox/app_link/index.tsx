import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "@bacons/react-views";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Link href="/beta">Push /beta</Link>
        <Link href="/beta" replace>
          Replace to /beta
        </Link>
        <Link href="https://github.com/expo/router" replace>
          Open external
        </Link>
        <Link href="/beta" asChild>
          <Pressable>
            {({ hovered }) => (
              <Text style={{ color: hovered ? "orange" : "black" }}>
                Push with custom Button
              </Text>
            )}
          </Pressable>
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
