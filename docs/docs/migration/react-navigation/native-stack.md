---
title: Native Stack
sidebar_position: 3
---

The `Stack` Layout in Expo Router wraps the [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator) from React Navigation, not to be confused with the legacy [JS Stack Navigator](https://reactnavigation.org/docs/stack-navigator).

For a list of all options, see the [Native Stack Navigator: Options](https://reactnavigation.org/docs/native-stack-navigator#options).

## Migration

Consider the following React Navigation block:

```js
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="details" component={Details} />
    </Stack.Navigator>
  );
}
```

This can be recreated with the following structure:

```bash title="File System"
app/
  _layout.js
  home.js
  details.js
```

```js title=app/_layout.js
import { Stack } from "expo-router/stack";

export default function Layout() {
  return <Stack initialRouteName="home" />;
}
```

> You should default to using `index` as the initial route instead of something like `home`.
