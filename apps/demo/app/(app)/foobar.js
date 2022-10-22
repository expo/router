import { Stack, useNavigation } from "expo-router";
import { Text, View } from "react-native";

import { useContextKey } from "expo-router/build/Route";
import { useLayoutEffect } from "react";

export default function App() {
  const k = useContextKey();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <Stack.Screen options={{ headerShown: true, title: "works!!" }} /> */}
      <Text>K! {k}</Text>
    </View>
  );
}
