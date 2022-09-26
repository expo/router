import { Link, useLink } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function App({ navigation }) {
  const link = useLink();

  return (
    <View style={styles.container}>
      <Link href="../" style={{ fontSize: 24, fontWeight: "bold" }}>
        Dismiss
      </Link>
      <Text
        onPress={() => {
          link.back();
        }}
      >
        Open settings dynamic
      </Text>
      <StatusBar barStyle="light-content" />
      {navigation.canGoBack() ? (
        <span>Can go back</span>
      ) : (
        <span>Can't go back</span>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
