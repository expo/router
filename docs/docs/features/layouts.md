---
title: Layouts
sidebar_position: 4
---

Layouts are parent components that provide a shared UI-driven navigation experience across multiple screens.

The simplest layouts (suited for web) are custom navigators that provide a single screen at a time. You can create a custom navigator by using the `<Children />` component.

```js title=app/_layout.js
// highlight-next-line
import { Children } from "expo-router";

export default function Page() {
  // Renders the matching child route.
  // highlight-next-line
  return <Children />;
}
```

Now create a child route to render inside the parent route:

```js title=app/child.js
export default function Page() {
  return <View />;
}
```

You can extend this to create a basic layout like the ones found in most websites:

```js title=app/_layout.js
import { View } from "react-native";
// highlight-next-line
import { Children, Link } from "expo-router";

export default function App() {
  return (
    <>
      {/* A basic navigation bar for web. */}
      <View>
        {/* It's better to use the Link component, but this works too. */}
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/settings">Settings</Link>
      </View>
      {/* Renders the selected child element. */}
      <Children />
    </>
  );
}
```

## Native

For that native feel, we have a few native navigators that you can use. These are **React Navigation** core navigators that have been wrapped to automatically use nested screens.

- `Stack` - A stack navigator that renders a screen from a stack. This is a native stack navigator that uses native animations and gestures. `@react-navigation/native-stack`
- `Tabs` - A tab navigator that renders a screen from a tab. `@react-navigation/bottom-tabs`

```tsx
// highlight-next-line
import { Tabs } from 'expo-router';

export default function Page() {
  // Accepts the same props as the React Navigation bottom tabs navigator.
  // The most common props are `screenOptions` and `initialRouteName`.
  // highlight-next-line
  return <Tabs { ... } />
}
```

Or even shorter form:

```tsx
import { Tabs } from "expo-router";

export default Tabs;
```

> `@react-navigation/stack` is not supported by default, you can use it by creating a custom layout.

## Custom

Custom layouts have an internal context that is ignored when using the `<Children />` component without a `<Layout />` component wrapping it.

```tsx
import { View } from "react-native";
import { TabRouter } from "@react-navigation/native";

import { Layout, useSegments, Children, Link } from "expo-router";

export default function App() {
  return (
    // highlight-next-line
    <Layout router={TabRouter}>
      <Header />
      <Children />
    </Layout>
  );
}

function Header() {
  const { navigation, state, descriptors, router } = Layout.useContext();

  const [segment] = useSegments();

  return (
    <View>
      <Link href="/">Home</Link>
      <Link
        href="/profile"
        // Use `pathname` to determine if the link is active.
        // highlight-next-line
        style={[segment === "profile" && { color: "blue" }]}
      >
        Profile
      </Link>
      <Link href="/settings">Settings</Link>
    </View>
  );
}
```

> In `expo-router`, you currently need all layout routes to be a navigator. This is because we don't have a way to render a route without a parent navigator.

## Converting Navigators to Layouts

You can make a React Navigation navigator into a layout by using the `withLayoutContext` function. Consider this example which makes a drawer navigator from `@react-navigation/drawer` into a layout:

```js
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";

import { withLayoutContext } from "expo-router";

const { Navigator } = createDrawerNavigator();

// Drawer is a layout component that can be automatically populated with routes.
export const Drawer = withLayoutContext<
  DrawerNavigationOptions,
  typeof Navigator
>(Navigator);
```
