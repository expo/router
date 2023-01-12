import { Text } from "react-native";
import { Stack } from "expo-router";
import { useAuth } from "../../context/auth";
import { NotesProvider } from "../../context/notes";

export default function AppLayout() {
  const { signOut } = useAuth();

  return (
    <NotesProvider>
      <Stack
        screenOptions={{
          headerRight: () => <Text onPress={() => signOut()}>Sign Out</Text>,
        }}
      />
    </NotesProvider>
  );
}
