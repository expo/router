import { useRouter, useSearchParams } from "expo-router";
import * as React from "react";
import { Button, Text, View } from "react-native";
import { items, lists } from "../../etc/data";

export default function List({ params }) {
  const router = useRouter();
  const { listId } = useSearchParams();
  console.log("listId", listId, params);
  if (!listId) {
    return <Text>Not Found</Text>;
    // throw new Error("Missing 'listId' in search params");
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
              pathname: "/item/[itemId]",
              params: { itemId },
            });
          }}
        />
      ))}
    </View>
  );
}
