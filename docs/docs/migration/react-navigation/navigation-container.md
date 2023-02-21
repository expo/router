---
title: Navigation Container
sidebar_position: 2
---

The global React Navigation [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/) is completely managed by Expo Router. Expo Router provides systems for achieving the same functionality as the `NavigationContainer` without needing to use it directly.

## ref

The `NavigationContainer` ref should not be accessed directly. Use the following methods instead.

### Methods on the `ref`

#### `resetRoot​`

Navigate to the initial route of the application. For example, if your app starts at `/` (recommended), then you can replace the current route with `/` using this method.

```js
import { useRouter } from "expo-router";

function Example() {
  const router = useRouter();

  return (
    <Text
      onPress={() => {
        // Go to the initial route of the application.
        router.resetRoot();
      }}
    >
      Reset App
    </Text>
  );
}
```

#### `getRootState`

Use `useRootNavigationState()`.

#### `getCurrentRoute`

Unlike React Navigation, Expo Router can reliably represent any route with a string. Use the [`usePathname()`](/docs/features/linking#usepathname) or [`useSegments()`](/docs/features/linking#usesegments) hooks to identify the current route.

#### `getCurrentOptions`

Use the [`useSearchParams()`](/docs/features/linking#useSearchParams) hook to get the current route's query parameters.

#### `addListener`

The following events can be migrated:

##### `state`

Use the [`usePathname()`](/docs/features/linking#usepathname) or [`useSegments()`](/docs/features/linking#usesegments) hooks to identify the current route. Use in conjunction with `useEffect(() => {}, [...])` to observe changes.

##### `options`

Use the [`useSearchParams()`](/docs/features/linking#useSearchParams) hook to get the current route's query parameters. Use in conjunction with `useEffect(() => {}, [...])` to observe changes.

## props

Migrate the following `<NavigationContainer />` props:

### `initialState`

In Expo Router, you can rehydrate your application state from a route string (e.g. `/user/evanbacon`). Use [redirects](/docs/features/linking#redirect) to handle initial states. See [shared routes](/docs/features/shared-routes) for advanced redirects.

Avoid using this pattern in favor of deep linking (e.g. user opens your app to `/profile` rather than from the home screen) as it is most analogous to the web. If an app crashes due to a particular screen, it's best to avoid automatically navigating back to that exact screen when the app starts as it may require reinstalling the app to fix.

### `onStateChange`

Use the [`usePathname()`](/docs/features/linking#usepathname), [`useSegments()`](/docs/features/linking#usesegments), and [`useSearchParams()`](/docs/features/linking#useSearchParams) hooks to identify the current route state. Use in conjunction with `useEffect(() => {}, [...])` to observe changes.

- If you're attempting to track screen changes, follow the [Screen Tracking guide](/docs/migration/react-navigation/screen-tracking).
- React Navigation recommends avoiding [`onStateChange`](https://reactnavigation.org/docs/navigation-container/#onstatechange).

### `onReady`

In React Navigation, [`onReady`](https://reactnavigation.org/docs/navigation-container/#onready) is most often used to determine when the splash screen should hide or when to track screens using analytics. Expo Router has special handling for both these use cases. Assume the navigation is always ready in for navigation events in Expo Router.

- See the [Screen Tracking guide](/docs/migration/react-navigation/screen-tracking) for info on migrating analytics from React Navigation.
- See the [Splash Screen feature](/docs/features/splash) for info on handling the splash screen.

### `onUnhandledAction`

Actions are always handled in Expo Router. Use [dynamic routes](/docs/features/dynamic-routes) and [404 screens](/docs/features/unmatched) in favor of [`onUnhandledAction`](https://reactnavigation.org/docs/navigation-container/#onunhandledaction).

### `linking`

The [`linking`](https://reactnavigation.org/docs/navigation-container/#linking) prop is automatically constructed based on the files to the `app/` directory.

### `fallback`

The [`fallback`](https://reactnavigation.org/docs/navigation-container/#fallback) prop is automatically handled by Expo Router. Learn more in the [Splash Screen guide](/docs/features/splash.md).

### `theme`

Use the `<ThemeProvider />` component instead. Learn more in the [Themes guide](/docs/migration/react-navigation/themes).

### `children`

The `children` prop is a automatically populated based on the files in the `app/` directory, and the currently open URL.

### `independent`

Expo Router does not support [`independent`](https://reactnavigation.org/docs/navigation-container/#independent) containers. This is because the router is responsible for managing the single `<NavigationContainer />`. Any additional containers will not be automatically managed by Expo Router.

### `documentTitle`

<!-- TODO: Replace this with an auto ssg / Expo Head component -->

This property is not yet supported in Expo Router. Set the web page title using [screen options](/docs/migration/react-navigation/screen.md).

### `ref`

<!-- TODO: Replace this with something like `useNavigation('...')` -->

Use the `useRootNavigation()` hook instead.
