# Navigators

Navigators are parent components that provide a specific navigation experience. They are responsible for managing the navigation state and rendering the correct content on the screen.

In `expo-router`, you currently need any parent route to be a navigator. This is because we don't have a way to render a route without a parent navigator.

The simplest version of this is:

```js
import { Children } from "expo-router";

export default function Page() {
  // Renders the currently selected child, auto adds a custom navigator if none exists.
  return <Children />;
}
```

You can extend this to create a basic layout like the ones found in most websites:

```js
import { Children } from "expo-router";

export default function App() {
  return (
    <>
      {/* A basic navigation bar for web. */}
      <nav>
        {/* It's better to use the Link component, but this works too. */}
        <a href="/">Home</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
      </nav>
      {/* Renders the selected child element. */}
      <Children />
    </>
  );
}
```

## Native Navigators

For that native feel, we have a few native navigators that you can use. These are **React Navigation** core navigators that have been wrapped to automatically use nested screens.

- `Stack` - A stack navigator that renders a screen from a stack. `@react-navigation/stack`
- `Tabs` - A tab navigator that renders a screen from a tab. `@react-navigation/bottom-tabs`
- `Drawer` - A drawer navigator that renders a screen from a drawer. `@react-navigation/drawer`
- `NativeStack` - A stack navigator that renders a screen from a stack. This is a native stack navigator that uses native animations and gestures. `@react-navigation/native-stack`

```tsx
import { Drawer } from 'expo-router';

export default function Page() {
  // Accepts the same props as the React Navigation Drawer Navigator.
  // The most common props are `screenOptions` and `initialRouteName`.
  return <Drawer { ... } />
}
```

Or even shorter form:

```tsx
import { Tabs } from "expo-router";

export default Tabs;
```

## Custom Navigators

```tsx
import { View } from "react-native";
import { TabRouter } from "@react-navigation/native";

import { Navigator, Children, Link } from "expo-router";

export default function App() {
  return (
    <Navigator router={TabRouter}>
      <Header />
      <Children />
    </Navigator>
  );
}

function Header() {
  const {
    // Access the internal state of the navigator.
    navigation,
    state,
    descriptors,
    router,
  } = Navigator.useContext();

  return (
    <View>
      <Link href="/">Home</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/settings">Settings</Link>
    </View>
  );
}
```
