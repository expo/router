Ports https://reactnavigation.org/docs/hello-react-navigation

```
app/
├─ index.js
├─ index/
│  ├─ home.js
│  ├─ details.js
```

```js
// app/index.js
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigator } from "expo-router";

const Nav = createStackNavigator();

export default function App() {
  const Navigator = useNavigator(Nav);
  return (
    <Navigator
      // https://reactnavigation.org/docs/hello-react-navigation#configuring-the-navigator
      initialRouteName="home"
    />
  );
}
```

```js
// app/index/home.js
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
// app/index/details.js
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

- Prefer `app/index/index.js` to `app/index/home.js` + `initialRouteName="home"`.
- Prefer `home` to `Home` for routes.
- Prefer `Home` to `HomeScreen` for components.
- `getNavOptions` does not allow for Fast Refresh.

- Use a React context: https://reactnavigation.org/docs/hello-react-navigation#passing-additional-props
