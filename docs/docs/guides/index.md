---
title: Building a layout
sidebar_position: 1
---

First create a **layout route** in `app/_layout.js` which uses the pre-built `Stack` component from `expo-router` to render a native stack navigator.

```js title=app/_layout.js
import { Stack } from "expo-router";

export default function Layout() {
  // highlight-next-line
  return <Stack />;
}
```

Now create a **child route** in `app/index.js` which will be rendered inside the stack navigator.

```js title=app/index.js
import { View } from "react-native";
import { Link, Stack } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Use the `Screen` component to configure the layout. */}
      <Stack.Screen options={{ title: "Overview" }} />
      {/* Use the `Link` component to enable optimized client-side routing. */}
      // highlight-next-line
      <Link href="/details">Go to Details</Link>
    </View>
  );
}
```

Now create a second child route to navigate to:

```js title=app/details.js
import { View, Text } from "react-native";

export default function Details({ navigation }) {
  return (
    <View>
      <Text
        onPress={() => {
          // Go back to the previous screen using the imperative API.
          // highlight-next-line
          navigation.goBack();
        }}
      >
        Details Screen
      </Text>
    </View>
  );
}
```

The final **file structure** should look like this:

```bash title="File System"
app/
  _layout.js
  index.js
  details.js
```

Ports the guide [React Navigation: Hello world](https://reactnavigation.org/docs/hello-react-navigation) to Expo Router.
