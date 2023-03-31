import "@expo/metro-runtime";

import { ExpoRoot } from "expo-router";

import { renderRootComponent } from "./src/renderRootComponent";

const ctx = require.context(process.env.EXPO_ROUTER_APP_ROOT);

// Must be exported or Fast Refresh won't update the context
export function App() {
  return <ExpoRoot context={ctx} />;
}

renderRootComponent(App);
