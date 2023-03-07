---
title: Stack
---

The `Stack` Layout in Expo Router wraps the [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator) from React Navigation, if you want to use the legacy [JS Stack Navigator](https://reactnavigation.org/docs/stack-navigator) then do the following.

## Installation

Follow the [installation guide](https://reactnavigation.org/docs/stack-navigator/#installation) for Stack Navigator.

## Setup

Contextualize the stack navigator to support the Expo Router file convention:

```js title=./CustomStack.tsx
import {
  // Import the creation function
  createStackNavigator,
  // Import the types
  StackNavigationOptions,
} from "@react-navigation/stack";

import { withLayoutContext } from "expo-router";

const { Navigator } = createStackNavigator();

// This can be used like `<CustomStack />`
export const CustomStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator
>(Navigator);
```

## Usage

```js title=app/_layout.js
import { CustomStack } from "../CustomStack";

export default function RootLayout() {
  return <CustomStack />;
}
```
