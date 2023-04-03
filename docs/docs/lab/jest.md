---
title: Testing with Jest
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

Expo Router adds first-class support for testing with `@testing-library/react-native`

## Setup

`yarn add -D @testing-library/react-native` or `npm install --save-dev @testing-library/react-native`

:::tip

`jest-expo` is not required, but highly recommended.

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
import { screen } from "expo-router/testing-library";

test("render the application", async () => {
  renderRouter();
  const signInText = await screen.findByText("Sign In");
  expect(signInText).toBeTruthy();
});
```

:::caution

`renderRouter` will forcefully enable `jest.useFakeTimers()`. Please refer to the [Jest Docs](https://jestjs.io/docs/timer-mocks) on how to advance and/or run timers.

:::

## API

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
