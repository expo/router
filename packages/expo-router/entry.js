import "@bacons/expo-metro-runtime";

import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Must be exported or Fast Refresh won't update the context >:[
export function App() {
  // Babel + Expo CLI: process.env.EXPO_APP_ROOT -> '../../apps/demo/app'
  //   console.log("output", process.env.EXPO_APP_ROOT);
  const ctx = require.context(process.env.EXPO_APP_ROOT);
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
