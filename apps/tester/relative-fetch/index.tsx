import { useEffect } from "react";
import {
  StyleSheet,
  TurboModuleRegistry,
  Text,
  View,
  Image,
} from "react-native";

export default function Page() {
  console.log("this:", window.location.origin + "/hello.json");

  useEffect(() => {
    fetch("/hello.json", {})
      .then((res) => res.json())
      .then(console.log);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={{ uri: location.origin + "/snack.png" }}
          style={{ width: 250, height: 250, backgroundColor: "blue" }}
        />
        <Text style={styles.title}>Hello Worl@d</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
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
