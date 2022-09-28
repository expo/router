import { Text } from "react-native";

export default function Page({ route }) {
  return <Text>[foo]/[bar]/index.js: {JSON.stringify(route.params)}</Text>;
}
