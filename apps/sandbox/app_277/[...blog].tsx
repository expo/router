import { usePathname, useSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log("[...blog].tsx", searchParams);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>[...blog].tsx</Text>
      <Text style={{ marginTop: 20, fontSize: 20 }}>Pathname: {pathname}</Text>
    </View>
  );
}
