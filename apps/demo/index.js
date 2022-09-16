import "@bacons/expo-metro-runtime";

import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Must be exported or Fast Refresh won't update the context >:[
export function App() {
  const ctx = require.context("./app");
  console.log("root context", ctx.keys());
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
