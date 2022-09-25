---
title: Layout Options
sidebar_position: 8
---

In React Navigation, you often use `screenOptions` to configure layout options. In `expo-router`, you can use the `<Screen />` component from any built-in layout to configure the nearest layout.

Consider the following stack layout:

```tsx title=app/(stack).tsx
// highlight-next-line
import { Stack } from "expo-router";

export default function Layout() {
  // highlight-next-line
  return <Stack />;
}
```

We can configure the title of the stack per-screen using the `<Stack.Screen />` component:

```tsx title=app/(stack)/index.tsx
import { View } from "react-native";
import { Stack } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      // highlight-next-line
      <Stack.Screen options={{ title: "Overview" }} />
    </View>
  );
}
```

The `options` are the same as the [`screenOptions` prop in React Navigation](https://reactnavigation.org/docs/screen-options/).

Sometimes you want static options to live outside the route component, this is useful for things like tabs or drawer items which should be configured before the route loads. You can use the `<Screen />` option directly in the layout component with the `name` prop set to the route name (file name without the extension):

```tsx title=app/(tabs).tsx
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      // highlight-next-line
      <Tabs.Screen name="index" options={{ title: "Overview" }} />
    </Tabs>
  );
}
```

You can use this system to the order of screens and tabs in a layout. For example, if you want to change the order of screens in a stack, you can use the `name` prop to specify the order:

```tsx title=app/(tabs).tsx
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      {/* The screens will now show up from left to right: index, settings, all other routes... */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
```
