import * as Device from "expo-device";
import { useEffect } from "react";
import { Text } from "react-native";

export default function Page() {
  useEffect(() => {
    Device.getDeviceTypeAsync().then((data) => alert("device:" + data));
  }, []);
  return (
    <div>
      <Text
        onPress={() => {
          alert("start");
          Device.getDeviceTypeAsync().then((data) => alert("device:" + data));
        }}
      >
        Hello Web World
      </Text>
      <TerminalIcon />
    </div>
  );
}

function TerminalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4"
    >
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" x2="20" y1="19" y2="19"></line>
    </svg>
  );
}

// TODO:
// import DomView from 'dom:https://github.com/'
// => export default (props) => <WebView source={{ uri: 'https://github.com/' }} {...props} />
