import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Search() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Search",
          headerSearchBarOptions: {
            placeholder: "Search",
          },
        }}
      />
      <View>
        <Text>Search</Text>
      </View>
    </>
  );
}
