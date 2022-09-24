---
title: Header buttons
sidebar_position: 6
---

Ports https://reactnavigation.org/docs/header-buttons

```
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
```

```js title=app/(stack).js
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

```js title=app/(stack)/home.js
import { useLayoutEffect } from "react";
import { View, Button, Text, Image } from "react-native";
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
