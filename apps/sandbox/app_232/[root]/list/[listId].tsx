import { useRouter, useLocalSearchParams, useSearchParams } from "expo-router";
import * as React from "react";
import { Button, Text, View } from "react-native";
import { items, lists } from "../../../etc/data";

export default function List() {
  const router = useRouter();
  const { listId } = useLocalSearchParams();
  console.log("listId", listId);
  if (!listId) {
    return <Text>Not Found</Text>;
  }

  const list = lists.find((l) => l.id === listId);

  return (
    <View>
      {list.items.map((itemId) => (
        <Button
          key={itemId}
          title={items.find((itm) => itm.id === itemId)!.name}
          onPress={() => {
            router.push({
              pathname: "[root]/item/[itemId]",
              params: { root: "root", itemId },
            });
          }}
        />
      ))}
    </View>
  );
}
