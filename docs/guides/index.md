# Getting Started

Install:

```sh
yarn add expo-router
```

Then use `expo-router/entry` as the entry point to your app in your `package.json`:

```json
{
  "main": "expo-router/entry"
}
```

## Beta setup

You'll also need to use the latest version of [Expo CLI](https://github.com/expo/expo/blob/main/packages/%40expo/cli/README.md#contributing) from the `main` branch.

And you'll need to configure your `metro.config.js` file as such:

```js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;
```

## Usage

```
yarn expo start
```
