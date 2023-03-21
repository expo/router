import { Link, usePathname } from "expo-router";
import { Text, View } from "react-native";

export default function IndexRoute() {
  const pathname = usePathname();
  console.log("rendered index route");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Index Route: {pathname}</Text>
      <Link style={styles} href="/exact">
        Go to exact route
      </Link>
      <Link style={styles} href="/bamboleo">
        Go to dynamic route
      </Link>
    </View>
  );
}

const styles = {
  marginVertical: 10,
  padding: 10,
  backgroundColor: "saddlebrown",
  color: "white",
};
