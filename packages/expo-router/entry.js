import "@expo/metro-runtime";

import { ExpoRoot } from "expo-router";
import Head from "expo-router/head";

import { renderRootComponent } from "./src/renderRootComponent";

// We add this elsewhere for rendering
const HeadProvider =
  typeof window === "undefined" ? React.Fragment : Head.Provider;

const ctx = require.context(process.env.EXPO_ROUTER_APP_ROOT);

// Must be exported or Fast Refresh won't update the context
export function App() {
  return (
    <HeadProvider>
      <ExpoRoot context={ctx} />
    </HeadProvider>
  );
}

renderRootComponent(App);
