---
title: Navigation Container
sidebar_position: 6
---

The global React Navigation [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/) is managed by Expo Router, you can pass it props like `theme` from any screen by using the `<RootContainer />` component.

```tsx title=app/_layout.tsx
import { RootContainer, Children } from "expo-router";
import { DarkTheme } from "@react-navigation/native";

export default function RootLayout() {
  return (
    <>
      {/* These props will be applied to the parent NavigationContainer. */}
      // highlight-next-line
      <RootContainer theme={DarkTheme} />
      <Children />
    </>
  );
}
```

## Statics

## `RootContainer.useRef()`

Access the [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/) ref with the `RootContainer.useRef()` function.

```tsx title=app/home.tsx
function Page() {
  // Returns null when the container has not finished mounting.
  const navigationRef = RootContainer.useRef();
  return <>...</>;
}
```

`RootContainer.useRef()` can be used to determine if the container has finished loading.

## `RootContainer.useState()`

Access the root navigation state with the `RootContainer.useState()` function.

```tsx title=app/home.tsx
function Page() {
  const state = RootContainer.useState();
  return <>...</>;
}
```

> Use this hook instead of the `onStateChange` property.

## Restrictions

The navigation container has many props that should not be used with Expo Router. Carefully reconsider how your app is using the following props before migrating to Expo Router.

### `onReady`

In React Navigation, [`onReady`](https://reactnavigation.org/docs/navigation-container/#onready) is most often used to determine when the splash screen should hide or when to track screens using analytics. Expo Router has special handling for these use cases.

- See the [Screen Tracking guide](/docs/guides/screen-tracking) for info on migrating analytics from React Navigation.
- See the [Splash Screen feature](/docs/features/splash.md) for info on handling the splash screen.

### `children`

The `children` prop is a automatically populated based on the files in the `app/` directory, and the currently open URL.

### `linking`

The [`linking`](https://reactnavigation.org/docs/navigation-container/#linking) prop can only be constructed by adding files to the `app/` directory.

### `initialState`

In React Navigation, the state can vary in complexity meaning rehydration requires a complex JavaScript object. In Expo Router, you can rehydrate your application state from a URL. Use [redirects](/docs/features/linking#redirect) to handle initial states.

Avoid using this pattern in favor of standard deep linking (e.g. user opens your app to `/profile` rather than from the home screen) as it is most analogous to the web.

### `independent`

Expo Router does not support [`independent`](https://reactnavigation.org/docs/navigation-container/#independent) containers. This is because the router is responsible for managing the single `<NavigationContainer />`. Any additional containers will not be automatically managed by Expo Router.

### `onUnhandledAction`

Use dynamic routes and [404 screens](/docs/features/unmatched) in favor of [`onUnhandledAction`](https://reactnavigation.org/docs/navigation-container/#onunhandledaction).

### `fallback`

The [`fallback`](https://reactnavigation.org/docs/navigation-container/#fallback) property is not required as Expo Router will prevent hiding the native splash screen until UI can be displayed.

### `onStateChange`

> React Navigation also recommends avoiding [`onStateChange`](https://reactnavigation.org/docs/navigation-container/#onstatechange).

- If you're attempting to track screen changes follow the [Screen Tracking guide](/docs/guides/screen-tracking) instead.
- If you need to see when the root navigation state changes (discouraged as the state format can change between versions), use the `RootContainer.useState()` hook instead.
- If you want to get the navigation state as a callback, then get the `navigation` object with `useNavigation` and invoke `navigation.addListener("state", ({ data: { state } }) => { })`.

### `ref`

Use the `RootContainer.useRef()` function instead.
