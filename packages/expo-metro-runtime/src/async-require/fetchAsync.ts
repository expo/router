import { Platform } from "react-native";

export async function fetchAsync(
  url: string
): Promise<{ body: string; headers: Headers }> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      // No real reason for this but we try to use this format for everything.
      "expo-platform": Platform.OS,
    },
  });
  return {
    body: await response.text(),
    headers: response.headers,
  };
}
