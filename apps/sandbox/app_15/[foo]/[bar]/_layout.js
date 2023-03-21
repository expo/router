import { Slot, useSearchParams } from "expo-router";
import { Text } from "react-native";

export default function Page() {
  const params = useSearchParams();
  return (
    <>
      <Text>[foo]/[bar].js: {JSON.stringify(params)}</Text>
      <Slot />
    </>
  );
}
