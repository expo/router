---
title: Themes
---

In React Navigation, you set the theme for the entire app using the [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/#theme) component. Expo Router manages the root container for you, so instead you should set the theme using the `ThemeProvider` directly.

```js title=app/_layout.tsx

import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from "@react-navigation/native";

import { Slot } from 'expo-router';

export default function RootLayout() {
    return (
        {/* All layouts inside this provider will use the dark theme. */}
        // highlight-next-line
        <ThemeProvider value={DarkTheme}>
            <Slot />
        </ThemeProvider>
    );
}
```

You can use this technique at any layer of the app to set the theme for a specific layout. The current theme can be accessed with `useTheme` from `@react-navigation/native`.
