import ExpoRouterRoot from "./_root";
import { renderRootComponent } from "./build/renderRootComponent";
import Head from "expo-router/head";
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
