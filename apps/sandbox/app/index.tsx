import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Button, View } from "react-native";
import { lists } from "../etc/data";

export default function Home() {
  const router = useRouter();

  return (
    <View>
      {lists.map((list, idx) => (
        <Link
          key={list.id}
          href={{
            pathname: "/list/[listId]",
            params: { listId: list.id },
          }}
        >
          {list.name}
        </Link>
      ))}
    </View>
  );
}
