import { Text, View, Pressable } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        className="bg-blue-300 rotate-0 scale-100 active:rotate-180 active:scale-150 transition-transform duration-1000"
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text className="text-white text-2xl p-10">Press and hold!</Text>
      </Pressable>
    </View>
  );
}

/*
 */
