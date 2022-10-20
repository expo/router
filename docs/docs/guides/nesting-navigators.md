---
title: Nesting navigators
sidebar_position: 7
---

Ports the guide [React Navigation: Nesting navigators](https://reactnavigation.org/docs/nesting-navigators) to Expo Router.

```bash title="File System"
app/
  _layout.js
  home.js
  home/
    feed.js # Matches /home/feed
    messages.js # Matches /home/messages
```

```js title=app/_layout.js
import { Stack } from "expo-router";

export default Stack;
```

This is nested in the `_layout.js` layout, so it will be rendered as a stack.

```js title=app/home.js
import { Tabs } from "expo-router";

export default Tabs;
```

```js title=app/profile.js
import { Link } from "expo-router";

export default function Feed() {
  return <Link href="/home/messages">Navigate to nested route</Link>;
}
```

This is nested in the `home.js` layout, so it will be rendered as a tab.

```js title=app/home/feed.js
import { View } from "react-native";

export default function Feed() {
  return <View />;
}
```

```js title=app/home/messages.js
import { View } from "react-native";

export default function Messages() {
  return <View />;
}
```

## Notes

- Navigation UI elements (Link, Tabs, Stack) may move out of the router package.
