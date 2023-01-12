import { Text, View } from "react-native";
import { useAuth } from "../../context/auth";

export default function SignIn() {
  const { signIn } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={() => signIn()}>Sign In</Text>
    </View>
  );
}
