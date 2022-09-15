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
import { StackNavigator } from "expo-router";

export default function App() {
  return (
    <StackNavigator
      // https://reactnavigation.org/docs/hello-react-navigation#configuring-the-navigator
      initialRouteName="home"
    />
  );
}
```

```js
// app/(stack)/home.js
import { View, Text } from "react-native";

// https://reactnavigation.org/docs/hello-react-navigation#specifying-options
export const getNavOptions = () => ({ title: "Overview" });

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}
```

```js
// app/(stack)/details.js
import { View, Text } from "react-native";

export default function DetailsScreen() {
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
- `getNavOptions` does not allow for Fast Refresh.

- Use a React context: https://reactnavigation.org/docs/hello-react-navigation#passing-additional-props
