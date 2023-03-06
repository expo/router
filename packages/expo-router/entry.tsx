import "@expo/metro-runtime";

import { ExpoRoot } from "expo-router";
import Head from "expo-router/head";
import React from "react";

import { renderRootComponent } from "./src/renderRootComponent";

// We add this elsewhere for rendering
const HeadProvider =
  typeof window === "undefined" ? React.Fragment : Head.Provider;

// @ts-expect-error
const ctx = require.context(
  process.env.EXPO_ROUTER_APP_ROOT,
  true,
  /.*/,
  "sync"
);

// Must be exported or Fast Refresh won't update the context
export function App() {
  return (
    <HeadProvider>
      <ExpoRoot context={ctx} />
    </HeadProvider>
  );
}

renderRootComponent(App);
