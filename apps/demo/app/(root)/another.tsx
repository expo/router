import { StyleSheet, Text, View } from "react-native";
import { GoogleAuth } from "../../etc/auth/google";

export default function Another() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Welcome</Text>
      <Text style={{ padding: 20, borderWidth: 2, borderColor: "black" }}>
        Another
      </Text>
    </View>
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
