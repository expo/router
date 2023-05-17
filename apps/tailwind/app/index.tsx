import { Text, View } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="bg-blue-300 active:rotate-180 active:scale-150 transition-transform duration-1000">
        <Text className="text-white text-2xl p-10">Press and hold!</Text>
      </View>
    </View>
  );
}
