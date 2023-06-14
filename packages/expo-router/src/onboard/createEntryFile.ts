import { getDevServer } from "../getDevServer";
import { removeFileSystemDots } from "../matchers";

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
      // Legacy
      path: "./app/index.js",
      // New
      absolutePath:
        process.env.EXPO_PROJECT_ROOT +
        "/" +
        removeFileSystemDots(process.env.EXPO_ROUTER_APP_ROOT!) +
        "/" +
        "./index.js",
    }),
  });
}

const TEMPLATE = `import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
`;
