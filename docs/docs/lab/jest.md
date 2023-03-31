---
title: Testing with Jest
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

Expo Router adds first-class support for testing with `@testing-library/react-native`

## Setup

`yarn add -D @testing-library/react-native` or `npm install --save-dev @testing-library/react-native`

> `jest-expo` is not required, but highly recommended

```tsx
// jest.config.js
module.exports = {
  preset: "jest-expo",
  roots: ["."],
};
```

## Writing a test

```
// my-component.test.ts
import { screen } from "expo-router/testing-library"

test("render the application", async () => {
  renderRouter();
  await screen.findByText('Sign In')
});
```

## API

`expo-router/testing-library` re-exports `@testing-library/react-native` and is a drop in replacement.

### renderRouter()

```tsx
import { RenderOptions as TLRenderOptions } from "@testing-library/react-native";

type RenderRouterOptions =
  | undefined
  | string
  | Record<string, Route>
  | { appDir?: string; overrides?: Record<string, Route> };

type RenderOptions = Omit<TLRenderOptions, "wrapper"> & {
  initialRoute?: string;
};

type renderRouter = (
  routerOptions?: RenderRouterOptions,
  renderOptions?: RenderOptions
) => ReturnType<typeof render>;
```

`renderRouter` has three rendering modes

- File system
- Inline
- Hybrid

The first argument speficies the render mode while the second

#### File system

`renderRouter(directory?: string)`

Renders application specified directory (defaults to `app/`)

#### Inline

```tsx
type Route =
  | () => ReactElement
  | { default: () => ReactELement }

renderRouter(routes: Record<string, Route>)`

```

Renders an app using only the routes w/ components specified. This allows you to quickly setup isolated environments to test your components

#### Hybrid

```tsx
type Route =
  | () => ReactElement
  | { default: () => ReactELement }

renderRouter(options: { appDir?: string; overrides?: Record<string, Route> })`
```

The hybrid approach mixes both file system routing with inline overrides. This mode allows you to easily test your application, while mocking only certain routes and/or layouts.
