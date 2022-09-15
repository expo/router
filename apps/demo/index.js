import "@bacons/expo-metro-runtime";

import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

registerRootComponent(function App() {
  return <ExpoRoot context={require.context("./app")} />;
});
