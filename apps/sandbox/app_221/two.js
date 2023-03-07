import { Button } from "react-native";
import { useRouter } from "expo-router";

export default function Two() {
  const router = useRouter();
  return <Button title="Send" onPress={() => router.push("/protected")} />;
}
