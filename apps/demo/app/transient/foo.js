import { Stack, useNavigation } from "expo-router";
import { Text } from "react-native";

import { useContextKey } from "expo-router/build/Route";
import { useLayoutEffect } from "react";

export default function App() {
  const k = useContextKey();
  const nav = useNavigation();
  console.log("nav:", nav.getId());

  useLayoutEffect(() => {
    nav.setOptions({
      title: "bean",
    });
  }, []);
  return (
    <>
      {/* <Stack.Screen options={{ headerShown: true, title: "works!!" }} /> */}
      <Text>{k}</Text>
    </>
  );
}
