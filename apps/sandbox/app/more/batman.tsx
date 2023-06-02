import { View, Text } from "react-native";
import { usePathname } from "expo-router";

export default function Page() {
  const pathname = usePathname();
  return (
    <View>
      <Text>Hey</Text>
    </View>
  );
}
