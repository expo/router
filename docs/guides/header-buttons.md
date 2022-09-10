Ports https://reactnavigation.org/docs/header-buttons

```
app/
├─ index.js
├─ index/
│  ├─ home.js
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
      initialRouteName="home"
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      // Prefers using a `<Header />` component.
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  );
}
```

```js
// app/index/home.js
import { useLayoutEffect } from "react";
import { View, Button, Text, Image } from "react-native";

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require("@expo/snack-static/react-native-logo.png")}
    />
  );
}

// NOTE(EvanBacon): Does not fast refresh. Prefers exposing a `<Header />` component in the `app/index.js`.
export const getNavOptions = () => ({
  headerTitle: (props) => <LogoTitle {...props} />,
  // https://reactnavigation.org/docs/header-buttons#adding-a-button-to-the-header
  headerRight: () => (
    <Button
      onPress={() => alert("This is a button!")}
      title="Info"
      color="#fff"
    />
  ),
});

export default function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);

  // https://reactnavigation.org/docs/header-buttons#header-interaction-with-its-screen-component
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
      ),
    });
  }, [navigation]);

  return <Text>Count: {count}</Text>;
}
```

## Notes

- Prefers a `<Header.Item />` component in the `app/index.js` file:

```js
// app/index.js
import {
  // NOTE(EvanBacon): New API
  Stack,
} from "@react-navigation/stack";
import { Button } from "react-native";

export default function App() {
  return (
    <Stack>
      {/* mode="screen" would clone this component into a wrapper for all screens. */}
      <Stack.Header tintColor="#fff" style={{ backgroundColor: "#f4511e" }}>
        <Header.Title />
        {/* Chooses the side (leading/trailing to support i18n). */}
        <Header.Item position="trailing">
          {/* Render child component. */}
          <Button
            onPress={() => alert("This is a button!")}
            title="Info"
            color="#fff"
          />
        </Header.Item>
      </Stack.Header>

      {/* Auto populated. */}
      <Stack.Screens />
    </Stack>
  );
}
```

- [overriding the back button](https://reactnavigation.org/docs/header-buttons#overriding-the-back-button): add to navigator.
