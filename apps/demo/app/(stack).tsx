import { NativeStackNavigator } from "expo-router";

export default function App() {
  return (
    <NativeStackNavigator
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
