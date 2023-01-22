import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Other!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
});
