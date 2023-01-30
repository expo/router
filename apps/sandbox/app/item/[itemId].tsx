import { useSearchParams } from "expo-router";
import * as React from "react";
import { Text, View } from "react-native";
import { items, lists } from "../../etc/data";

export default function Item({ params }) {
  const { itemId } = useSearchParams();
  console.log("itemId", itemId, params);

  if (!itemId) {
    // throw new Error("Missing 'itemId' in search params");
    return <Text>Not Found</Text>;
  }

  const item = items.find((itm) => itm.id === itemId);

  return (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
}
