---
title: Introduction
description: File-based Routing for React Native apps
sidebar_position: 1
slug: /
---

Expo Router brings the best routing concepts from the web to native iOS and Android apps. Every file in the **app** directory automatically becomes a route in your mobile navigation, making it easier than ever to build, maintain, and scale your project. It's built on top of our powerful [React Navigation suite](https://reactnavigation.org/) enabling truly native navigation. The entire deep linking system is automatically generated live, so users can share links to any route in your app.

## Quick Start

Run the following to create a project with `expo-router` setup:

```bash
npx create-expo-app@latest --example with-router
```

> [Example source](https://github.com/expo/examples/tree/master/with-router).

## Features

<!-- <video src="/router/demo/routing.mp4" controls style={{ width: "100%" }} autoplay loop /> -->

- **Native** Truly native navigation with the most cutting-edge developer experience.
<!-- - **Zero-config** No need to configure anything, just start building your app. -->
- **Deep linking** Every screen in your app is automatically deep linkable. Making any part of your app shareable.
- **Offline-first** Apps are cached and run offline-first, with automatic updates when you publish a new version. Handles all incoming native URLs without a network connection or server.
- **Scale** Apps are built with a modular architecture that scales to any size. Refactoring and upgrading are a breeze due to the declarative nature of the API.
- **Iteration** Universal Fast Refresh across iOS, Android, and web along with artifact memoziation in the bundler keep you moving fast at scale.
- **Cross-Platform** Expo Router is a large step towards universal React apps. The same codebase can be used to build iOS, Android, and web apps.

## Getting Started

> Expo Router supports `expo@46.0.13` and greater.

Ensure your computer is [setup for running an Expo app](https://docs.expo.dev/get-started/installation/).

Create a new Expo project:

```bash
npx create-expo-app
```

Install `expo-router` and peer dependencies:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

Then delete the entry point in your `package.json`, or replace it with `index.js` to be explicit:

```json
{
  "main": "index.js"
}
```

Create a new file `index.js` in the root of your project. If it exists already, replace it with the following:

```js
import "expo-router/entry";
```

Add a deep linking `scheme` and enable [`metro` web](https://docs.expo.dev/guides/customizing-metro/#web-support-how) in your `app.json` (or `app.config.js`):

```json
{
  "expo": {
    "scheme": "myapp",

    "web": {
      "bundler": "metro"
    }
  }
}
```

<!-- 76 is required for typed routes plugin -->

Ensure you're using at least `metro@0.76.0` by setting a Yarn resolution or npm override.

If you use **Yarn**:

```json title=package.json
{
  "resolutions": {
    "metro": "0.76.0",
    "metro-resolver": "0.76.0",
    "metro-config": "0.76.0",
    "metro-transform-worker": "0.76.0"
  }
}
```

If you use **npm**, this requires npm 8.3.0 or higher. You can install this with `npm i -g npm@^8.3.0`. After that, configure `overrides` in `package.json`:

```json title=package.json
{
  "overrides": {
    "metro": "0.76.0",
    "metro-resolver": "0.76.0"
  }
}
```

### Configure the Babel plugin

```js title=babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [require.resolve("expo-router/babel")],
  };
};
```

## Usage

Start the server with:

```
npx expo --clear
```

Then open by pressing `i`, `a`, or `w` for web (only tested against Metro web).

Create files in the `app` directory and they will be automatically added to the app.

## Troubleshooting

If you run into any issues, please check the [troubleshooting guide](/router/docs/troubleshooting). If you're still running into problems, please [open an issue](https://github.com/expo/router/issues).

## Next Steps

- [Routing](/docs/features/routing).
- [Linking](/docs/features/linking).
- [Guides](/docs/category/guides).
- [Migrating from React Navigation](/docs/category/react-navigation).
