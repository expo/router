---
title: Screen
---

Qualified layouts, like the ones found in `expo-router` (Stack, Tabs, Layout) have a static `Screen` component which can be used to configure the behavior of a route declaratively.

All `Screen` components are the same and render `null`, but they have different types for convenience. The common props are:

- **name**: _string_ The name of the route to configure. This can only be used when the `Screen` is a child of a layout component.
- **redirect**: _true | string | undefined_ When `true`, redirects the request to the nearest sibling route in a layout. When a `string` matching the name of a sibling is used, the redirect will go to the provided sibling.
- **options**: _T | undefined_ The options to pass to the route. The type varies depending on the layout. Options can be used for `Screen` components rendered anywhere.

## Dynamic options

In React Navigation, you often use `screenOptions` to configure layout options. In `expo-router`, you can use the `<Screen />` component from any built-in layout to configure the nearest layout.

Consider the following stack layout:

```tsx title=app/_layout.tsx
// highlight-next-line
import { Stack } from "expo-router";

export default function Layout() {
  // highlight-next-line
  return <Stack />;
}
```

We can configure the title of the stack per-screen using the `<Stack.Screen />` component:

```tsx title=app/index.tsx
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

## Static options

Sometimes you want static options to live outside the route component, this is useful for things like tabs or drawer items which should be configured before the route loads. You can use the `<Screen />` option directly in the layout component with the `name` prop set to the route name (file name without the extension):

```tsx title=app/_layout.tsx
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

```tsx title=app/_layout.tsx
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

You can also use a relative path as the `name` prop to access a parent layout's options:

```tsx title=app/tabs/page.tsx
import { Stack, Tabs } from "expo-router";

export default function Page() {
  return (
    <>
      <Stack.Screen name="../../" options={{ ... }} />
      <Tabs.Screen name="/_layout.js" options={{ ... }} />
    </>
  );
}
```
