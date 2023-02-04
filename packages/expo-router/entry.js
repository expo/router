import Head from "expo-router/head";

import ExpoRouterRoot from "./_root";
import { renderRootComponent } from "./build/renderRootComponent";

// We add this elsewhere for rendering
const HeadProvider =
  typeof window === "undefined" ? React.Fragment : Head.Provider;

function App() {
  return (
    <HeadProvider>
      <ExpoRouterRoot />
    </HeadProvider>
  );
}

renderRootComponent(App);
