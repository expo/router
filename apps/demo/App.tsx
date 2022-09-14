import "@bacons/expo-metro-runtime";

import { Root } from "expo-router";

export default function App() {
  // TODO: Make context automatically injected.
  return (<Root context={require.context('./app')} />);
}
