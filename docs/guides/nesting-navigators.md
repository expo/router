Ports https://reactnavigation.org/docs/nesting-navigators

```
app/
├─ index.js
├─ index/
│  ├─ home.js
│  ├─ home/
│    ├─ feed.js
│    ├─ messages.js
```

```js
// app/index.js
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigator } from "expo-router";

const Nav = createStackNavigator();

export default function App() {
  const Navigator = useNavigator(Nav);
  return <Navigator />;
}
```

This is nested in the `App` navigator, so it will be rendered as a stack.

```js
// app/index/home.js
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigator } from "expo-router";

const Nav = createBottomTabNavigator();

export default function Home() {
  const Navigator = useNavigator(Nav);
  return <Navigator />;
}
```

```js
// app/index/profile.js
import { Text } from "react-native";

export default function Feed({ navigation }) {
  return (
    <Text
      onPress={() => {
        // NOTE(EvanBacon): Prefers `/home/messages`
        navigation.navigate("home", { screen: "messages" });
      }}
    >
      Navigate to nested route
    </Text>
  );
}
```

This is nested in the `Home` navigator, so it will be rendered as a tab.

```js
// app/index/home/feed.js
import { View } from "react-native";

export default function Feed() {
  return <View />;
}
```

```js
// app/index/home/messages.js
import { View } from "react-native";

export default function Messages() {
  return <View />;
}
```

## Notes
