import { Link, usePathname } from "expo-router";
import { Text, View } from "react-native";

export default function ExactRoute() {
  const pathname = usePathname()
  console.log("rendered exact route");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Exact Route: {pathname}</Text>
      <Link href="/">Go Home</Link>
      <Link href="/random">Random</Link>
    </View>
  );
}
