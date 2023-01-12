import { Text } from "react-native";
import { Link, Stack } from "expo-router";
import { useAuth } from "../../context/auth";
import { NotesProvider } from "../../context/notes";

import { StatusBar } from "expo-status-bar";

function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Link
      href="/sign-in"
      onPress={(ev) => {
        ev.preventDefault();
        signOut();
      }}
    >
      <Text
        style={{
          fontWeight: "normal",
          paddingHorizontal: 8,
          fontSize: 16,
        }}
      >
        Sign Out
      </Text>
    </Link>
  );
}

function DismissComposeButton() {
  return (
    <Link href="/">
      <Text
        style={{
          fontWeight: "normal",
          paddingHorizontal: 8,
          fontSize: 16,
        }}
      >
        Back
      </Text>
    </Link>
  );
}

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AppLayout() {
  return (
    <NotesProvider>
      <StatusBar style="auto" />

      <Stack
        screenOptions={{
          headerRight: SignOutButton,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Notes",
            headerLargeTitle: true,
            headerSearchBarOptions: {},
          }}
        />
        <Stack.Screen
          name="compose"
          options={{
            title: "Compose",
            presentation: "modal",
            headerRight: DismissComposeButton,
          }}
        />
      </Stack>
    </NotesProvider>
  );
}
