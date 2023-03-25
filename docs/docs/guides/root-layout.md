---
title: Root Layout
---

Traditional React Native projects are structured with a single root component that is often defined in `./App.js` or `./index.js`. This pattern is often used to inject global providers such as Redux, Themes, Styles, etc. into the app, and to delay rendering until assets and fonts are loaded.

In Expo Router, you can use the **Root Layout** (`app/_layout.js`) to add providers which can be accessed by any route in the app.

> Try to reduce the scope of your providers to only the routes that need them. This will improve performance and cause less rerenders.

## Loading Fonts

The following example demonstrates how fonts are loaded in a traditional React Native project using `@expo-google-fonts/inter`.

**Before**

```js title=App.js
import { useEffect } from "react";

import { Text, View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import { useFonts, Inter_500Medium } from "@expo-google-fonts/inter";

// Prevent hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Load the font `Inter_500Medium`
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen after the fonts have loaded and the
      // UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Prevent rendering until the font has loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inter Black</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter_500Medium",
  },
});
```

**After**

In a Layout Route, we'll ensure all the requisite assets are loaded before rendering the children that depend on the assets.

```js title=app/_layout.js
import { Text, View } from "react-native";

import {
  // Import `SplashScreen` from `expo-router` instead of `expo-splash-screen`
  // highlight-next-line
  SplashScreen,

  // This example uses a basic Layout component, but you can use any Layout.
  Slot,
} from "expo-router";

import { useFonts, Inter_500Medium } from "@expo-google-fonts/inter";

export default function Layout() {
  // Load the font `Inter_500Medium`
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    // The native splash screen will stay visible for as long as there
    // are `<SplashScreen />` components mounted. This component can be nested.

    // highlight-next-line
    return <SplashScreen />;
  }

  // Render the children routes now that all the assets are loaded.
  return <Slot />;
}
```

## More

- [Migrating React Navigation themes](/docs/migration/react-navigation/themes.md)
