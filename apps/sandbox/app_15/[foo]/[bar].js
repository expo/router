import { Children } from "expo-router";
import { Text } from "react-native";

export default function Page({ route }) {
  return (
    <>
      <Text>[foo]/[bar].js: {JSON.stringify(route.params)}</Text>
      <Children />
    </>
  );
}
