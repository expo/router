---
title: Styling
---

> This guide refers to upcoming Expo Router features.

Expo Router adds first-class support for a number of CSS features which can be leveraged to create more optimized web experiences.

The preferred way to style your application is to use the `StyleSheet` API. This API is available on both web and native.

## Global Styles

> Global styles are web-only, usage will cause your application to diverge visually on native.

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

- Add `css` to the list of source extensions.
- Use the Expo Babel transformer.

```js title=metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  // Use the Expo transformer.
  babelTransformerPath: require.resolve("@expo/metro-runtime/transformer"),
};

// Ensure CSS is treated as a source file.
config.resolver.sourceExts.push("css");

module.exports = config;
```

### Advanced Setup

If you need to apply other transformations to your source before using the CSS transformer, you can create a custom Metro transformer.

```js title=transformer.js
const ExpoTransformer = require("@expo/metro-runtime/transformer");

module.exports.transform = async (props) => {
  // Mutate the `props` as needed before passing it to the Expo transformer.

  // The Expo transformer will apply any changes then run through the default
  // Metro transformer.
  return ExpoTransformer.transform(props);
};
```
