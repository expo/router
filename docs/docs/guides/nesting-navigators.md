---
title: Nesting navigators
sidebar_position: 7
---

Ports https://reactnavigation.org/docs/nesting-navigators

```sh
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
│  ├─ home/
│    ├─ feed.js # Matches /home/feed
│    ├─ messages.js # Matches /home/messages
```

```js title=app/(stack).js
import { Stack } from "expo-router";

export default Stack;
```

This is nested in the `(stack).js` layout, so it will be rendered as a stack.

```js title=app/(stack)/home.js
import { Tabs } from "expo-router";

export default function Home() {
  return <Tabs />;
}
```

```js title=app/(stack)/profile.js
import { Link } from "expo-router";

export default function Feed() {
  return <Link href="/home/messages">Navigate to nested route</Link>;
}
```

This is nested in the `(stack)/home.js` layout, so it will be rendered as a tab.

```js title=app/(stack)/home/feed.js
import { View } from "react-native";

export default function Feed() {
  return <View />;
}
```

```js title=app/(stack)/home/messages.js
import { View } from "react-native";

export default function Messages() {
  return <View />;
}
```

## Notes

- Navigation UI elements (Link, Tabs, Stack) may move out of the router package.
