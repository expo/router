Ports https://reactnavigation.org/docs/hello-react-navigation

**File Structure**

```sh
app
├─ (stack).js
├─ (stack)
│  ├─ index.js
│  ├─ details.js
```

First create a **layout route** in `app/stack.js` which uses the pre-built `Stack` component from `expo-router` to render a native stack navigator.

```js
// app/(stack).js
import { Stack } from "expo-router";

export default function Layout() {
  return <Stack />;
}
```

Now create a **child route** in `app/(stack)/index.js` which will be rendered inside the stack navigator.

```js
// app/(stack)/index.js
import { View, Text } from "react-native";
import { Link, ScreenOptions } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Use the `ScreenOptions` component to configure the layout. */}
      <ScreenOptions title="Overview" />
      {/* Use the `Link` component to enable optimized client-side routing. */}
      <Link href="/details">Go to Details</Link>
    </View>
  );
}
```

Now create a second child route to navigate to:

```js
// app/(stack)/details.js
import { View, Text } from "react-native";

export default function Details({ navigation }) {
  return (
    <View>
      <Text
        onPress={() => {
          // Go back to the previous screen
          navigation.goBack();
        }}
      >
        Details Screen
      </Text>
    </View>
  );
}
```
