Ports https://reactnavigation.org/docs/headers

```
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
│  ├─ details.js
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
import { Link, Stack } from "expo-router";
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
      <Stack.Screen
        options={{
          // https://reactnavigation.org/docs/headers#setting-the-header-title
          title: "My home",
          // https://reactnavigation.org/docs/headers#adjusting-header-styles
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
          headerTitle: (props) => <LogoTitle {...props} />,
        }}
      />

      <Text>Home Screen</Text>

      <Link href={{ screen: "details", params: { name: "Bacon" } }}>
        Go to Details
      </Link>
    </View>
  );
}
```

```js title=app/(stack)/details.tsx
import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function Details({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* NOTE(EvanBacon): Preferred way to use route to update navigation options. */}
      <Stack.Screen
        option={{
          title: route?.params?.name,
        }}
      />
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
