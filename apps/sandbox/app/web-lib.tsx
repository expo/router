import { Head } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Platform } from "expo-modules-core";

export default function Page() {
  if (!Platform.isDOMAvailable) {
    return null;
  }
  const { EmojiPicker } =
    require("../etc/emoji") as typeof import("../etc/emoji");

  return (
    <>
      <Head>
        <title>Emoji Picker</title>
        <meta
          name="description"
          content="Demo of an emoji picker component with global style sheets."
        />
      </Head>

      <View style={styles.container}>
        <View style={styles.main}>
          <EmojiPicker onSelect={() => {}} />
        </View>
      </View>
    </>
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
  mainTitle: {
    fontSize: 36,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    color: "#38434D",
  },
});
