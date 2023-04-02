---
title: Bundle Splitting
# TODO
sidebar_class_name: hidden
---

> This guide refers to upcoming Expo Router features, all of which are experimental. You may need to use [Expo CLI on main](https://github.com/expo/expo/blob/main/packages/%40expo/cli/README.md#contributing) to enable this feature.

Unlike standard projects, Expo Router can automatically split your JavaScript bundle based on the route files, using [React Suspense](https://react.dev/reference/react/Suspense). This enables faster development as only the routes you navigate to will be bundled/loaded into memory. This can also be useful for reducing the initial bundle size for your application.

## Setup

Configure Metro to use Expo's bundle splitting features:

```js title=metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  asyncRequireModulePath: require.resolve("@expo/metro-runtime/async-require"),
};

config.server = {
  ...config.server,
  experimentalImportBundleSupport: true,
};

module.exports = config;
```

Next, enable the feature:

```json title=app.json
{
  "expo": {
    "extra": {
      "router": {
        "asyncRoutes": "development"
      }
    }
  }
}
```

Now you'll need to clear the bundler cache: `npx expo start --clear` or `npx expo export --clear`

## Development

Metro Bundler has a special development-only bundle splitting feature which can be used to defer bundling unused code until it is needed. This system was developed at Meta for incrementally developing the Facebook app at scale, Expo Router enables you to use it automatically!

## Production

Production bundle splitting is still in development. When you bundle for production, all suspense boundaries will be disabled and there will be no loading states.

Apps using the Hermes Engine will not benefit much from bundle splitting as the bytecode is already memory mapped ahead of time. We plan to add support regardless for faster over-the-air updates, React Server Components, and web support.

## How it works

<!-- TODO: Loading states -->

All Routes are loaded asynchronously, and loaded inside a suspense boundary. This means that the first time you navigate to a route, it will take a little longer to load. However, once it is loaded, it will be cached and subsequent visits will be instant. The [Suspense fallback](https://react.dev/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) or loading state **cannot be customized** at this time, we plan to add support in the future via a `<route>+loading.js` file.

<!-- TODO: Errors -->

Loading errors are handled in the parent route, via the [`ErrorBoundary`](/docs/features/errors) export. This will probably be refactored in the future to use a `<route>+error.js` file.

Async routes cannot be statically filtered during development, so all files will be treated as routes even if they don't export a default component. After the component is bundled and loaded, then any invalid route will use a fallback warning screen. This behavior is development-only and will not be present in production.

### Static Rendering

The current static rendering system doesn't support React Suspense, so we have to disable it when rendering static pages. This will be improved in the future.
