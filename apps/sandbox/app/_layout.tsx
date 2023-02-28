import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          animation: "fade",
          customAnimationOnGesture: true,
          headerTintColor: "white",
          headerShown: true,
          headerTransparent: true,
          headerBackground() {
            return (
              <LinearGradient
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 200,
                }}
                locations={[0.5, 1]}
                colors={["rgba(0,0,0,1)", "rgba(0,0,0,0)"]}
              />
            );
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </>
  );
}
