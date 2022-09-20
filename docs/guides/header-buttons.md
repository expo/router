Ports https://reactnavigation.org/docs/header-buttons

```
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
```

```js
// app/(stack).js
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
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
import { ScreenOptions } from "expo-router";

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require("@expo/snack-static/react-native-logo.png")}
    />
  );
}

export default function Home() {
  const [count, setCount] = React.useState(0);

  return (
    // https://reactnavigation.org/docs/header-buttons#header-interaction-with-its-screen-component
    <>
      <ScreenOptions
        headerTitle={(props) => <LogoTitle {...props} />}
        headerRight={() => (
          <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
        )}
      />
      <Text>Count: {count}</Text>
    </>
  );
}
```

## Notes

- Prefers a `<Header.Item />` component in the `app/(stack).js` file:

```js
// app/(stack).js
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
        <Stack.Header.Title />
        {/* Chooses the side (leading/trailing to support i18n). */}
        <Stack.Header.Item position="trailing">
          {/* Render child component. */}
          <Button
            onPress={() => alert("This is a button!")}
            title="Info"
            color="#fff"
          />
        </Stack.Header.Item>
      </Stack.Header>

      {/* Auto populated. */}
      <Stack.Content />
    </Stack>
  );
}
```

- [overriding the back button](https://reactnavigation.org/docs/header-buttons#overriding-the-back-button): add to navigator.
