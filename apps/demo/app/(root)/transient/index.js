import { Stack } from "expo-router";
import { Text } from "react-native";

export default function App() {
  return (
    <>
      <Stack.Screen options={{ title: "works" }} />
      <Text>Hey</Text>
    </>
  );
}
