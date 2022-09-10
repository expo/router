import "@bacons/expo-metro-runtime";

import { AutoNav } from "expo-router";

export default function App() {
  // TODO: Make context automatically injected.
  return (<AutoNav context={require.context('./app')} />);
}
