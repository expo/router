---
title: Styling
---

> This guide refers to upcoming Expo Router features, all of which are experimental. You may need to [use Expo CLI on `main`](https://github.com/expo/expo/tree/main/packages/%40expo/cli#contributing) to use these features.

Expo Router adds first-class support for a number of CSS features which can be leveraged to create more optimized web experiences.

The preferred way to style your application is to use the `StyleSheet` API. This API is available on both web and native.

## Global Styles

> This guide requires `expo@49.0.0-alpha.3` or greater––everything listed here is still experimental.

> Warning: Global styles are web-only, usage will cause your application to diverge visually on native.

You can import a CSS file from any component. The CSS will be applied to the entire page.

```js title=App.js
import "./styles.css";

export default function App() {
  return <div className="container">Hello World</div>;
}
```

```css title=styles.css
.container {
  background-color: red;
}
```

This technique also applies to stylesheets that are vendored in libraries.

```js title=App.js
// Applies the styles app-wide.
import "emoji-mart/css/emoji-mart.css";
```

- On native, all global stylesheets are automatically ignored.
- Hot reloading is supported for global stylesheets, simply save the file and the changes will be applied.

<!-- TODO: CSS Modules, Tailwind, Sass, scss  -->

## Setup

To enable CSS support, add the following changes to your Metro configuration:

```js title=metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

module.exports = config;
```
