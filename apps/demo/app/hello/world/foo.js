import { RootContainer } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <View style={styles.container}>
      <Text>Index!</Text>
      <RootContainer theme={isDark ? DarkTheme : DefaultTheme} />
      <StatusBar style={isDark ? "light" : "auto"} />
      <Text
        onPress={() => {
          setIsDark(!isDark);
        }}
        style={{ padding: 24, fontSize: 16, fontWeight: "bold" }}
      >
        Toggle theme
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
