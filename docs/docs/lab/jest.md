---
title: Testing with Jest
# TODO
sidebar_class_name: hidden
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

Expo Router adds first-class support for testing with [`Jest`](https://jestjs.io/)

## Setup

`yarn add -D jest @testing-library/react-native` or `npm install --save-dev jest @testing-library/react-native`

:::tip

We recommend using the `jest-expo` preset to quickly configure Jest for React Native

```tsx
// jest.config.js
module.exports = {
  preset: "jest-expo",
  roots: ["."],
};
```

:::

## Writing a test

```tsx
// my-component.test.ts
import { screen, renderRouter } from "expo-router/testing-library";

test("render the application", async () => {
  renderRouter();
  const signInText = await screen.findByText("Sign In");
  expect(signInText).toBeTruthy();
});
```

:::caution

`renderRouter` will forcefully enable `jest.useFakeTimers()`. Please refer to the [Jest Docs](https://jestjs.io/docs/timer-mocks) on how to advance and/or run timers.

:::

## Renders

`expo-router/testing-library` can be used as a dropin replacement for [`@testing-library/react-native`](https://callstack.github.io/react-native-testing-library/).

Additionally, the following extra functions are available

### renderRouter()

A helper function that wraps `render` from `@testing-library/react-native`. Renders your Expo Router application in a way that allows for testing.

`renderRouter()` has 3 methods of rendering:

- Rendering the `/app` directory
- Rendering a mock `/app` directory
- Rendering the `/app` directory, with file mocks

All render options also accepts the same options as [`render`](https://callstack.github.io/react-native-testing-library/docs/api#render-options), with the following additional options:

##### `initialRoute` option

```tsx
initialRoute?: string
```

This option allows you to control the initial rendered route.

#### Rendering the `/app` directory

`renderRouter(directory?: string, options?: RenderOptions)`

Renders application specified directory (defaults to `app/`)

#### Rendering a mock `/app` directory

```tsx
renderRouter(routes: Record<string, Route>, options?: RenderOptions)`
```

Renders an app using only the routes w/ components specified. This allows you to quickly setup isolated environments to test your components

#### Rendering the `/app` directory, with file mocks

```tsx

renderRouter(routes: { appDir?: string; overrides?: Record<string, Route> }, options?: RenderOptions)`
```

The hybrid approach mixes both file system routing with inline overrides. This mode allows you to easily test your application, while mocking only certain routes and/or layouts.

#### Mock routes

```
type Route =
  | () => ReactElement
  | { default: () => ReactELement }
```

When mocking a router, you can either define it as a function, or an object with a default property

## Matchers

### `.toHavePathname()`

```tsx
expect(screen).toHavePathname(string);
```

Asserts that the currently rendered screen has the expected pathname.

### `.toHaveSearchParams()`

```tsx
expect(screen).toHaveSearchParams(object);
```

Asserts that the currently rendered screen has the expected search params

:::tip

If you need to assett the URLSearchParams object, you can do so via `screen.getSearchParams()``

:::

## Screen methods

### `getPathname()`

```tsx
const pathname = screen.getPathname();
```

Returns the pathname of the currently rendered screen.

### `getSearchParams()`

```tsx
const urlSearchParams: URLSearchParams = screen.getSearchParams();
```

Returns the URLSearchParams of the currently rendered screen.
