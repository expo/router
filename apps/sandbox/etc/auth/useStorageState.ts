import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";

import { useMounted, useSafeState, UseStateHook } from "./utils";

// Fallback to AsyncStorage for web support
const setItemAsync = Platform.select<
  (key: string, value: string) => Promise<void>
>({
  default: SecureStore.setItemAsync,
  web: AsyncStorage.setItem,
});

const deleteItemAsync = Platform.select<(key: string) => Promise<void>>({
  default: SecureStore.deleteItemAsync,
  web: AsyncStorage.removeItem,
});

const getItemAsync = Platform.select<(key: string) => Promise<string | null>>({
  default: SecureStore.getItemAsync,
  web: AsyncStorage.getItem,
});

export async function setStorageItemAsync(
  key: string,
  value: string | null
): Promise<string | null> {
  if (value == null) {
    await deleteItemAsync(key);
  } else {
    await setItemAsync(key, value);
  }
  return value;
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useSafeState<string>();

  // Sanity
  const isMounted = useMounted();

  // Get
  React.useEffect(() => {
    getItemAsync(key)
      .then((value) => {
        if (isMounted) setState({ value });
      })
      .catch((error) => {
        if (isMounted) setState({ error });
      });
  }, [key]);

  // Set
  const setValue = React.useCallback(
    (value: string | null) => {
      setStorageItemAsync(key, value)
        .then((value) => {
          if (isMounted) setState({ value });
        })
        .catch((error) => {
          if (isMounted) setState({ error });
        });
    },
    [key]
  );

  return [state, setValue];
}
