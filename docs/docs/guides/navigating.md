---
title: Moving between screens
sidebar_position: 3
---

Ports the guide [React Navigation: Navigating](https://reactnavigation.org/docs/navigating) to Expo Router.

```bash title="File System"
app/
  (stack).js
  (stack)/
    home.js
    details.js
```

```js title=app/(stack).js
import { Stack } from "expo-router";

export default function Layout() {
  return <Stack initialRouteName="home" />;
}
```

```js title=app/(stack)/home.js
import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Link href="/details">Go to Details</Link>
    </View>
  );
}
```

```js title=app/(stack)/details.js
import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function Details({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>

      <Link href="/home">Go to Home</Link>

      <Button
        title="Go to Details... again"
        onPress={() => navigation.push("details")}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}
```
