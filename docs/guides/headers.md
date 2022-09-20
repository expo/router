Ports https://reactnavigation.org/docs/headers

```
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
│  ├─ details.js
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
import { Link, ScreenOptions } from "expo-router";
import { Image, Text, View } from "react-native";

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
    />
  );
}

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ScreenOptions
        // https://reactnavigation.org/docs/headers#setting-the-header-title
        title="My home"
        // https://reactnavigation.org/docs/headers#adjusting-header-styles
        headerStyle={{ backgroundColor: "#f4511e" }}
        headerTintColor="#fff"
        headerTitleStyle={{
          fontWeight: "bold",
        }}
        // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
        headerTitle={(props) => <LogoTitle {...props} />}
      />

      <Text>Home Screen</Text>

      <Link href={{ screen: "details", params: { name: "Bacon" } }}>
        Go to Details
      </Link>
    </View>
  );
}
```

```js
// app/(stack)/details.tsx
import { View, Text } from "react-native";
import { ScreenOptions } from "expo-router";

export default function Details({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* NOTE(EvanBacon): Preferred way to use route to update navigation options. */}
      <ScreenOptions title={route?.params?.name} />
      <Text
        onPress={() => {
          navigation.setParams({ name: "Updated" });
        }}
      >
        Update the title
      </Text>
    </View>
  );
}
```

## Notes

- Prefers a `<Header />` component in the `app/index.js` file:

```tsx
// app/(stack).js
import {
  // NOTE(EvanBacon): New API
  Stack,
} from "expo-router";

export default function Layout() {
  const route = useRoute();
  return (
    <Stack>
      {/* mode="screen" would clone this component into a wrapper for all screens. */}
      <Stack.Header tintColor="#fff" style={{ backgroundColor: "#f4511e" }}>
        <Stack.Header.Title
          style={{ fontWeight: "bold" }}
          {/* Could use context to populate some default values. */}
          title={route === "home" ? "Home" : "Details"}
        />
      </Stack.Header>

      {/* Auto populated. */}
      <Stack.Screens initial="home" />
    </Stack>
  );
}
```
