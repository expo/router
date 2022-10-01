import { Stack } from "expo-router";
import { Text } from "react-native";

export default function App() {
  return (
    <>
      <Stack.Screen options={{ title: "value" }} />
      <Text>Value</Text>
    </>
  );
}
