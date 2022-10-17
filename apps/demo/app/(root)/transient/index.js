import { Stack } from "expo-router";
import { Text } from "react-native";

import { useContextKey } from "expo-router/build/Route";

export default function App() {
  const k = useContextKey();
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "works" }} />
      <Text>{k}</Text>
    </>
  );
}
