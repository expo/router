import { Tabs, useNavigation } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  const rootNavigation = useNavigation("/");
  return (
    <View style={styles.container}>
      <Tabs.Screen name="../" options={{ headerShown: true, title: "Home" }} />
      <Tabs.Screen
        name="../../"
        options={{ headerShown: true, title: "Parent of Home" }}
      />
      <Text>Configuring parents</Text>
      <Text
        onPress={() => {
          rootNavigation.setOptions({
            title: "Hello from the root",
            headerShown: true,
          });
        }}
      >
        Set top most parent title
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
});
