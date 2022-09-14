import { getDevServer } from "../getDevServer";

/** Middleware for creating an entry file in the project. */
export function createEntryFileAsync() {
  if (process.env.NODE_ENV === "production") {
    // No dev server
    console.warn("createEntryFile() cannot be used in production");
    return;
  }

  const baseUrl = getDevServer().url;
  // Pings middleware in the Expo CLI dev server.
  return fetch(baseUrl + "/_expo/touch", {
    method: "POST",
    body: JSON.stringify({
      // Use a preset in the Expo CLI dev server.
      contents: TEMPLATE,
      path: "app/index.js",
    }),
  });
}

const TEMPLATE = `import { View, Text } from 'react-native';

// Learn more: TODO
export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Entry file 👋</Text>
    </View>
  );
}`;
