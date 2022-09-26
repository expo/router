---
title: Introduction
sidebar_position: 1
---

:::warning Beta Release

Expo Router is in the earliest stage of development. The API is subject to breaking changes. The documentation is incomplete and may be inaccurate. The project is not yet ready for production use. Please [contribute to the discussion](https://github.com/expo/router/discussions/1) if you have any ideas or suggestions on how we can improve the convention.

:::

Expo Router brings the best routing concepts from the web to native iOS and Android apps. Every file in the **app** directory automatically becomes a route in your mobile navigation, making it easier than ever to build, maintain, and scale your project. It's built on top of our powerful [React Navigation suite](https://reactnavigation.org/) enabling truly native navigation. The entire deep linking system is automatically generated live, so users can share links to any route in your app.

## Features

- **Native** Truly native navigation with the most cutting-edge developer experience.
<!-- - **Zero-config** No need to configure anything, just start building your app. -->
- **Deep linking** Every screen in your app is automatically deep linkable. Making any part of your app shareable.
- **Offline-first** Apps are cached and run offline-first, with automatic updates when you publish a new version. Handles all incoming native URLs without a network connection or server.
- **Scale** Apps are built with a modular architecture that scales to any size. Refactoring and upgrading are a breeze due to the declarative nature of the API.
- **Iteration** Universal Fast Refresh across iOS, Android, and web along with artifact memoziation in the bundler keep you moving fast at scale.
- **Cross-Platform** Expo Router is a large step towards universal React apps. The same codebase can be used to build iOS, Android, and web apps.

## Getting Started

Ensure your computer is [setup for running an Expo app](https://docs.expo.dev/get-started/installation/).

Create a new Expo project:

```bash
npx create-expo-app
```

Install `expo-router`:

```bash
npx expo install expo-router
```

<!-- Then use `expo-router/entry` as the entry point to your app in your `package.json`:

```json
{
  "main": "expo-router/entry"
}
``` -->

## Beta setup

During the beta, you'll also need to use the latest version of [Expo CLI](https://github.com/expo/expo/blob/main/packages/%40expo/cli/README.md#contributing) from the [`@evanbacon/cli/touch-middleware`](https://github.com/expo/expo/compare/%40evanbacon/cli/touch-middleware) branch.

And you'll need to configure your `metro.config.js` file as such:

```js title=metro.config.js
// NOTE: `expo-router/metro-config` is a temporary version of `expo/metro-config`.
const { getDefaultConfig } = require("expo-router/metro-config");
module.exports = require("expo-router/metro-config").getDefaultConfig(
  __dirname
);
```

You'll also need to resolve the latest version of Metro bundler to use our upstreamed features (this is required for Expo SDK 46):

```json title=package.json
{
  "resolutions": {
    "metro": "0.72.3"
  }
}
```

Configure the babel plugin:

```js title=babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      // NOTE: `expo-router/babel` is a temporary extension to `babel-preset-expo`.
      require.resolve("expo-router/babel"),
    ],
  };
};
```

Configure the entry point in your `package.json`:

```json title=package.json
{
  "main": "index.js"
}
```

Now create a new `index.js` file:

```tsx title=index.js
// Only required for Metro web
import "@bacons/expo-metro-runtime";

import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Must be exported or Fast Refresh won't update the context module
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
```

> This will be replaced with a single `expo-router/entry` import in the future, but it requires [extra CLI functionality](https://github.com/expo/expo/pull/19231).

Install packages which need to be in the local package.json due to the way React Native CLI links native modules:

```bash
npx expo install react-native-safe-area-context react-native-screens react-native-reanimated react-native-gesture-handler
```

> We plan to move the installation of these packages to the `expo-router` package in the future.

## Metro web setup

The router is tied to the bundler which is currently only built for Metro. If you want to use the router with web, you'll need to enable Expo CLI's experimental Metro web support:

```js title=app.json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

> Metro web font icons don't work: [pending PR](https://github.com/expo/expo/pull/19234).

## Usage

Start the server with:

```
yarn expo start
```

Then open by pressing `i`, `a`, or `w` for web (only tested against Metro web).

Create files in the `app` directory and they will be automatically added to the app.

## Next Steps

- [Guides](/docs/category/guides).
- [Features and conventions](/docs/category/features).
