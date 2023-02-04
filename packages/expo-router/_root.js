import "@expo/metro-runtime";

import { ExpoRoot } from "expo-router";

// Must be exported or Fast Refresh won't update the context >:[
export default function ExpoRouterRoot() {
  return (
    <ExpoRoot context={require.context(process.env.EXPO_ROUTER_APP_ROOT)} />
  );
}
