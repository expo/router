import { getDevServer } from "../getDevServer";

// Docs page for expo router
export const DOCS_URL = "TODO";

/** Middleware for creating an entry file in the project. */
export function createEntryFileAsync() {
  if (process.env.NODE_ENV === "production") {
    // No dev server
    console.warn("createEntryFile() cannot be used in production");
    return;
  }

  // Pings middleware in the Expo CLI dev server.
  return fetch(getDevServer().url + "_expo/touch", {
    method: "POST",
    body: JSON.stringify({
      contents: TEMPLATE,
      path: "./app/index.js",
    }),
  });
}

const TEMPLATE = `import { View, Text } from 'react-native';

// Learn more: ${DOCS_URL}
export default function Page() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 36 }}>Entry file 👋</Text>
    </View>
  );
}`;
