import { NativeStack, Layout, withLayoutContext } from "expo-router";
import { Text } from "react-native";

export default function Root() {
  const auth = false;

  return (
    <Layout>
      <Layout.Screen
        name="(tab)"
        hidden
        options={{
          // hidden: true,
          headerShown: false,
        }}
      />
      <Layout.Screen
        name="modal"
        options={{
          presentation: "modal",
        }}
      />

      <Layout.Children />
    </Layout>
  );
  return (
    <NativeStack>
      <NativeStack.Screen
        name="(tab)"
        options={{
          hidden: true,
          headerShown: false,
        }}
      />
      <NativeStack.Screen
        name="modal"
        options={{
          presentation: "modal",
        }}
      />
    </NativeStack>
  );
}
