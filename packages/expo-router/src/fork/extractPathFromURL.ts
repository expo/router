import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Linking from "expo-linking";

// This is only run on native.
export function extractExpoPathFromURL(url: string) {
  // Handle special URLs used in Expo Go: `/--/pathname` -> `pathname`
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    const pathname = url.match(/exps?:\/\/.*?\/--\/(.*)/)?.[1];
    if (pathname) {
      return pathname;
    }
    // Fallback on default behavior
  }

  const res = Linking.parse(url);
  const qs = !res.queryParams
    ? ""
    : Object.entries(res.queryParams)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
  return (res.path || "") + (qs ? "?" + qs : "");
}
