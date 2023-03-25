---
title: Nesting navigators
sidebar_position: 7
---

Native apps tend to have lots of shared UI elements, like headers, footers, and tab bars. This guide demonstrates how to use Expo Router to nest navigators.

> Avoid nesting `<Stack />` navigators inside other `<Stack />` navigators, this will cause unexpected pushing/popping behavior. Instead, opt to use `<Slot />` to hard switch between screens.

Ports the guide [React Navigation: Nesting navigators](https://reactnavigation.org/docs/nesting-navigators) to Expo Router.

```bash title="File System"
app/
  _layout.js
  index.js
  home/
    _layout.js
    feed.js # Matches /home/feed
    messages.js # Matches /home/messages
```

```js title=app/_layout.js
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

This is nested in the `_layout.js` layout, so it will be rendered as a stack.

```js title=app/home/_layout.js
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return <Tabs />;
}
```

```js title=app/index.js
import { Link } from "expo-router";

export default function Root() {
  return <Link href="/home/messages">Navigate to nested route</Link>;
}
```

This is nested in the `home/_layout.js` layout, so it will be rendered as a tab.

```js title=app/home/feed.js
import { View, Text } from "react-native";

export default function Feed() {
  return (
    <View>
      <Text>Feed screen</Text>
    </View>
  );
}
```

```js title=app/home/messages.js
import { View, Text } from "react-native";

export default function Messages() {
  return (
    <View>
      <Text>Messages screen</Text>
    </View>
  );
}
```

## Notes

- Navigation UI elements (Link, Tabs, Stack) may move out of the router package.
