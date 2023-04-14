import { Text, View } from "react-native";

export default function Page() {
  return (
    <View className="p-4 flex-1 items-center">
      <View className="flex-1 max-w-4xl justify-center">
        <Text className="text-orange-500 text-6xl font-bold">Hello World</Text>
        <Text className="text-slate-700 text-4xl">
          This is the first page of your app.
        </Text>
      </View>
    </View>
  );
}
