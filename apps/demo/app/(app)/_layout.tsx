import { Platform, Text } from "react-native";
import { Link, Stack, useNavigation, useRouter } from "expo-router";
import { useAuth } from "../../context/auth";
import { NotesProvider } from "../../context/notes";

import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useRootNavigation } from "expo-router/build/useRootNavigation";

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
  const router = useRouter();

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
            headerSearchBarOptions: {
              onChangeText: (event) => {
                // Update the query params to match the search query.
                router.setParams({
                  q: event.nativeEvent.text,
                });
              },
            },
          }}
        />
        <Stack.Screen
          name="compose"
          options={{
            title: "Compose",
            presentation: "modal",
            headerRight: Platform.select({
              ios: DismissComposeButton,
            }),
          }}
        />
      </Stack>
    </NotesProvider>
  );
}
