import { usePathname } from "expo-router";
import { Text, View } from "react-native";
export default function DynamicRoute() {
  const pathname = usePathname()
  console.log("rendered dynamic route");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Dynamic Route: {pathname}</Text>
    </View>
  );
}
