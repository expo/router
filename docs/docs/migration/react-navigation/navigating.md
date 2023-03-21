---
title: Moving between screens
sidebar_position: 3
---

Ports the guide [React Navigation: Navigating](https://reactnavigation.org/docs/navigating) to Expo Router.

```bash title="File System"
app/
  _layout.js
  home.js
  details.js
```

```js title=app/_layout.js
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "home",
};

export default function Layout() {
  return <Stack initialRouteName="home" />;
}
```

```js title=app/home.js
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

```js title=app/details.js
import { View, Text, Button } from "react-native";
import { Link, useNavigation, useRouter } from "expo-router";

export default function Details() {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>

      <Link href="/home">Go to Home</Link>

      <Button
        title="Go to Details... again"
        onPress={() => router.push("/details")}
      />
      <Button title="Go back" onPress={() => router.back()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}
```
