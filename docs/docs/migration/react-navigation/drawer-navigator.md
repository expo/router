---
title: Drawer navigation
---

To use the React Navigation [drawer navigator](https://reactnavigation.org/docs/drawer-based-navigation) with Expo Router, do the following:

## Installation

Follow the [installation guide](https://reactnavigation.org/docs/drawer-navigator#installation) for Drawer Navigator.

- Ensure `react-native-reanimated` is correctly configured in the `babel.config.js` file.
- Changes to the `babel.config.js` require a clean babel cache to be applied: `npx expo start --clear`.

## Setup

Contextualize the drawer navigator to support the Expo Router file convention:

```ts title=./Drawer.tsx
import {
  // Import the creation function
  createDrawerNavigator,
  // Import the types
  DrawerNavigationOptions,
} from "@react-navigation/drawer";

import { withLayoutContext } from "expo-router";

const { Navigator } = createDrawerNavigator();

// This can be used like `<Drawer />`
export const Drawer = withLayoutContext<
  DrawerNavigationOptions,
  typeof Navigator
>(Navigator);
```

## Usage

```js title=app/_layout.js
import { Drawer } from "../Drawer";

export default function RootLayout() {
  return <Drawer />;
}
```
