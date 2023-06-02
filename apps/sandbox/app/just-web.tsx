import WebView from "react-native-webview";

export default function Page() {
  return (
    <WebView
      style={{ flex: 1 }}
      source={{
        uri: "https://github.com/expo/router/compare/%40evanbacon/router/dom-routes?expand=1",
      }}
    />
  );
}
