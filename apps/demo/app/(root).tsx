import { Stack } from "expo-router";

export default function Root() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"modal"} options={{ presentation: "modal" }} />
    </Stack>
  );
}