import { Text, View } from "@bacons/react-views";
import {} from "expo-router/build/link/virtualLocation";
import { useLink } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function UrlBar() {
  const location = useLink();
  console.log("URL:", location);
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        bottom: bottom + 8,
        right: 8,
        padding: 8,
        backgroundColor: "#1c2026",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        left: 8,
      }}
    >
      <Text
        style={{
          //   fontWeight: "bold",
          color: "#8697A7",
          fontSize: 16,
        }}
      >
        {location.asPath}
      </Text>
    </View>
  );
}
