import { NativeStack } from "expo-router";

export default function Layout() {
  return (
    <NativeStack>
      <NativeStack.Screen
        name="(tab)"
        options={{
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
