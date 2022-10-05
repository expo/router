---
title: Layouts
sidebar_position: 4
---

Layouts are parent components that provide a shared UI-driven navigation experience across multiple screens.

The simplest layouts (suited for web) are custom navigators that provide a single screen at a time. You can create a custom navigator by using the `<Children />` component.

```js title=app/parent.js
// highlight-next-line
import { Children } from "expo-router";

export default function Page() {
  // Renders the matching child route.
  // highlight-next-line
  return <Children />;
}
```

Now create a child route to render inside the parent route:

```js title=app/parent/child.js
export default function Page() {
  return <View />;
}
```

You can extend this to create a basic layout like the ones found in most websites:

```js title=app/parent.js
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

- `Stack` - A stack navigator that renders a screen from a stack. `@react-navigation/stack`
- `Tabs` - A tab navigator that renders a screen from a tab. `@react-navigation/bottom-tabs`
- `Drawer` - A drawer navigator that renders a screen from a drawer. `@react-navigation/drawer`
- `NativeStack` - A stack navigator that renders a screen from a stack. This is a native stack navigator that uses native animations and gestures. `@react-navigation/native-stack`

```tsx
// highlight-next-line
import { Drawer } from 'expo-router';

export default function Page() {
  // Accepts the same props as the React Navigation Drawer Navigator.
  // The most common props are `screenOptions` and `initialRouteName`.
  // highlight-next-line
  return <Drawer { ... } />
}
```

Or even shorter form:

```tsx
import { Tabs } from "expo-router";

export default Tabs;
```

## Custom

Custom layouts have an internal context that is ignored when using the `<Children />` component without a `<Layout />` component wrapping it.

```tsx
import { View } from "react-native";
import { TabRouter } from "@react-navigation/native";

import { Layout, useLink, Children, Link } from "expo-router";

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

  const { pathname } = useLink();

  return (
    <View>
      <Link href="/">Home</Link>
      <Link
        href="/profile"
        // Use `pathname` to determine if the link is active.
        // highlight-next-line
        style={[pathname === "/profile" && { color: "blue" }]}
      >
        Profile
      </Link>
      <Link href="/settings">Settings</Link>
    </View>
  );
}
```

> In `expo-router`, you currently need all layout routes to be a navigator. This is because we don't have a way to render a route without a parent navigator.

## Pure Native

Expo Router exports the `NativeStack` component which provides access to the underlying native navigation primitives like `UINavigationController` on iOS and `Fragment` on Android. This is a drop-in replacement for `createNativeStackNavigator` from React Navigation.

```tsx title=app/(stack).tsx
import { NativeStack } from "expo-router";

export default function Layout() {
  return <NativeStack />;
}
```

Behind the scenes, this API uses the `react-native-screens` native module.
