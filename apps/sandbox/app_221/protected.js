import { Button } from "react-native";
import { useRouter, useSearchParams, Redirect } from "expo-router";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();

  if (!params.permissions) {
    return <Redirect href="permissions" />;
  }

  return <Button title="Go home" onPress={() => router.back()} />;
}
