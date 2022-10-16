import { Text, View } from "@bacons/react-views";
import { useHref } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function UrlBar() {
  const location = useHref();
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
          color: "#8697A7",
          fontSize: 16,
        }}
      >
        {location.href}
      </Text>
    </View>
  );
}
