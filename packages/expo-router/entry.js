// `@expo/metro-runtime` MUST be the first import to ensure Fast Refresh works
// on web.
import "@expo/metro-runtime";
import { ExpoRoot } from "expo-router";
import Head from "expo-router/head";
import { renderRootComponent } from "expo-router/src/renderRootComponent";

import { ctx } from "./_ctx";

// Must be exported or Fast Refresh won't update the context
export function App() {
  return (
    <Head.Provider>
      <ExpoRoot context={ctx} />
    </Head.Provider>
  );
}

renderRootComponent(App);
