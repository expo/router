---
title: Header buttons
sidebar_position: 6
---

Ports the guide [React Navigation: header buttons](https://reactnavigation.org/docs/header-buttons) to Expo Router.

```bash title="File System"
app/
  _layout.js
  home.js
```

You can use the `<Stack.Screen name={routeName} />` component in the layout component route to statically configure screen options. This is useful for tab bars or drawers which need to have an icon defined ahead of time.

```js title=app/_layout.js
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="home"
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      // highlight-next-line
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Optionally configure static options outside the route. */}
      // highlight-next-line
      <Stack.Screen name="home" options={{}} />
    </Stack>
  );
}
```

Use the `<Stack.Screen />` component in the child route to dynamically configure options.

```js title=app/home.js
import { Button, Text, Image } from "react-native";
// highlight-next-line
import { Stack } from "expo-router";

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
      // highlight-next-line
      <Stack.Screen
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            <Button
              onPress={() => setCount((c) => c + 1)}
              title="Update count"
            />
          ),
        }}
      />
      <Text>Count: {count}</Text>
    </>
  );
}
```
