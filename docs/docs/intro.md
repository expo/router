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

Create a new Expo project (`expo@46.0.13` and greater):

```bash
npx create-expo-app
```

Install `expo-router`:

```bash
npx expo install expo-router
```

Then use `expo-router/entry` as the entry point to your app in your `package.json`:

```json
{
  "main": "expo-router/entry"
}
```

## Beta setup

Ensure you're using at least `metro@0.72.3` by setting a yarn resolution (this step goes away in Expo SDK 47):

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

Install packages which need to be in the local package.json due to the way React Native CLI links native modules:

```bash
npx expo install react-native-safe-area-context react-native-screens react-native-reanimated react-native-gesture-handler
```

> We plan to move the installation of these packages to the `expo-router` package in the future.

## Metro web setup

The router is tied to the bundler which is currently only built for Metro. If you want to use the router with web, you'll need to enable Expo CLI's [experimental Metro web support](https://docs.expo.dev/guides/customizing-metro/#web-support):

```js title=app.json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

## Usage

Start the server with:

```
yarn expo start
```

Then open by pressing `i`, `a`, or `w` for web (only tested against Metro web).

Create files in the `app` directory and they will be automatically added to the app.

## Next Steps

- [Guides](/router/docs/guides/).
- [Features and conventions](/docs/category/features).
