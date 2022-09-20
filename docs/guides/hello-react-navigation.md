Ports https://reactnavigation.org/docs/hello-react-navigation

```
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
│  ├─ details.js
```

```js
// app/(stack).js
import { Stack } from "expo-router";

export default function App() {
  return (
    <Stack
      // https://reactnavigation.org/docs/hello-react-navigation#configuring-the-navigator
      initialRouteName="home"
    />
  );
}
```

```js
// app/(stack)/home.js
import { View, Text } from "react-native";
import { ScreenOptions } from "expo-router";

export default function Home() {
  return (
    <View>
      {/* https://reactnavigation.org/docs/hello-react-navigation#specifying-options */}
      <ScreenOptions title="Overview" />
      <Text>Home Screen</Text>
    </View>
  );
}
```

```js
// app/(stack)/details.js
import { View, Text } from "react-native";

export default function Details() {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}
```

## Notes

- Prefer `app/(stack)/index.js` to `app/(stack)/home.js` + `initialRouteName="home"`.
- Prefer `home` to `Home` for routes.
- Prefer `Home` to `HomeScreen` for components.
- `getNavOptions` does not allow for Fast Refresh but can be loaded statically (good for drawers and tab bars). Use `<ScreenOptions />` otherwise.

- Use a React context: https://reactnavigation.org/docs/hello-react-navigation#passing-additional-props
