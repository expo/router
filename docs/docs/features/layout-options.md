---
title: Layout Options
sidebar_position: 8
---

In React Navigation, you often use `screenOptions` to configure layout options. In `expo-router`, you can use the `<LayoutOptions />` component in a route to configure the nearest layout.

Consider the following stack layout:

```tsx title=app/(stack).tsx
import { Stack } from "expo-router";

export default function Layout() {
  return <Stack />;
}
```

We can configure the title of the stack per-screen using the `<LayoutOptions />` component:

```tsx title=app/(stack)/index.tsx
import { View } from "react-native";
import { LayoutOptions } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LayoutOptions title="Overview" />
    </View>
  );
}
```

## Layout Options

`<LayoutOptions />` props are the same as the [`screenOptions` prop in React Navigation](https://reactnavigation.org/docs/screen-options/).
