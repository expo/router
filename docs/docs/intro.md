---
title: Introduction
sidebar_position: 1
---

:::warning Beta Release

Expo Router is in the earliest stage of development. The API is subject to breaking changes. The documentation is incomplete and may be inaccurate. The project is not yet ready for production use. Please [contribute to the discussion](https://github.com/expo/router/discussions/1) if you have any ideas or suggestions on how we can improve the convention.

:::

Expo Router is a zero-config framework for building complex native iOS and Android apps based on the project's file system. Build fast apps that run offline-first, with complete deep linking support automatically enabled for every screen in your app.

Expo router is built on top of our powerful [React Navigation suite](https://reactnavigation.org/) of libraries, making it easy to bring your existing React Navigation code to the new router.

## Features

- **Native** Truly native navigation with the most cutting-edge developer experience.
- **Zero-config** No need to configure anything, just start building your app.
- **Deep linking** Every screen in your app is automatically deep linkable. Making any part of your app shareable.
- **Offline-first** Apps are cached and run offline-first, with automatic updates when you publish a new version. Handles all incoming native URLs without a network connection or server.
- **Scale** Apps are built with a modular architecture that scales to any size. Refactoring and upgrading are a breeze due to the declarative nature of the API.
- **Iteration** Universal Fast Refresh across iOS, Android, and web along with intelligent artifact memoziation in the bundler keep you moving fast at scale.

## Getting Started

Ensure your computer is [setup for running an Expo app](https://docs.expo.dev/get-started/installation/).

Create a new Expo project:

```sh
npx create-expo-app
```

Install `expo-router`:

```sh
npx expo install expo-router
```

Then use `expo-router/entry` as the entry point to your app in your `package.json`:

```json
{
  "main": "expo-router/entry"
}
```

## Beta setup

During the beta, you'll also need to use the latest version of [Expo CLI](https://github.com/expo/expo/blob/main/packages/%40expo/cli/README.md#contributing) from the [`@evanbacon/cli/touch-middleware`](https://github.com/expo/expo/compare/%40evanbacon/cli/touch-middleware) branch.

And you'll need to configure your `metro.config.js` file as such:

```js title=metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;
```

You'll also need to resolve the latest version of Metro bundler to use our upstreamed features:

```json title=package.json
{
  "resolutions": {
    "metro": "0.72.2",
    "metro-babel-transformer": "0.72.2",
    "metro-cache": "0.72.2",
    "metro-cache-key": "0.72.2",
    "metro-config": "0.72.2",
    "metro-core": "0.72.2",
    "metro-hermes-compiler": "0.72.2",
    "metro-minify-uglify": "0.72.2",
    "metro-react-native-babel-preset": "0.72.2",
    "metro-react-native-babel-transformer": "0.72.2",
    "metro-resolver": "0.72.2",
    "metro-source-map": "0.72.2",
    "metro-symbolicate": "0.72.2",
    "metro-transform-plugins": "0.72.2",
    "metro-transform-worker": "0.72.2"
  }
}
```

## Usage

```
yarn expo start
```
