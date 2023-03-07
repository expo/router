import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Text, View } from "react-native";
import { items } from "../../../etc/data";

export default function Item() {
  const { itemId } = useLocalSearchParams();
  console.log("itemId", itemId);

  if (!itemId) {
    return <Text>Not Found</Text>;
  }

  const item = items.find((itm) => itm.id === itemId);

  return (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
}
