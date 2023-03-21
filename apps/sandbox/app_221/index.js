import { Button } from "react-native";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  return <Button title="Two" onPress={() => router.push("/two")} />;
}
