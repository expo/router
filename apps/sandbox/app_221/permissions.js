import { Button } from "react-native";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <Button title="Go back" onPress={() => router.back()} />
      <Button
        title="Grant permissions"
        onPress={() => {
          router.replace({
            pathname: "protected",
            params: { permissions: true },
          });
        }}
      />
    </>
  );
}
