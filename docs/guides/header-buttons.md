Ports https://reactnavigation.org/docs/header-buttons

```
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
```

```js
// app/(stack).js
import { StackNavigator } from "expo-router";

export default function App() {
  return (
    <StackNavigator
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
// app/(stack)/home.js
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

// NOTE(EvanBacon): Does not fast refresh. Prefers exposing a `<Header />` component in the `app/(stack).js`.
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

- Prefers a `<Header.Item />` component in the `app/(stack).js` file:

```js
// app/(stack).js
import {
  // NOTE(EvanBacon): New API
  StackNavigator,
} from "@react-navigation/stack";
import { Button } from "react-native";

export default function App() {
  return (
    <StackNavigator>
      {/* mode="screen" would clone this component into a wrapper for all screens. */}
      <StackNavigator.Header
        tintColor="#fff"
        style={{ backgroundColor: "#f4511e" }}
      >
        <StackNavigator.Header.Title />
        {/* Chooses the side (leading/trailing to support i18n). */}
        <StackNavigator.Header.Item position="trailing">
          {/* Render child component. */}
          <Button
            onPress={() => alert("This is a button!")}
            title="Info"
            color="#fff"
          />
        </StackNavigator.Header.Item>
      </StackNavigator.Header>

      {/* Auto populated. */}
      <StackNavigator.Screens />
    </StackNavigator>
  );
}
```

- [overriding the back button](https://reactnavigation.org/docs/header-buttons#overriding-the-back-button): add to navigator.
