---
title: Configuring the header bar
sidebar_position: 5
---

Ports the guide [React Navigation: header buttons](https://reactnavigation.org/docs/headers) to Expo Router.

```bash title="File System"
app/
  _layout.js
  home.js
  details.js
```

Use the `screenOptions` prop to configure the header bar.

```js title=app/_layout.js
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="home"
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

You can use a layout's Screen component to configure the header bar dynamically from within the route. This is good for interactions that change the UI.

```js title=app/home.js
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

You can use the imperative API `router.setParams()` function to configure the route dynamically.

```js title=app/details.tsx
import { View, Text } from "react-native";
import { Stack, useSearchParams, useRouter } from "expo-router";

export default function Details() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        option={{
          title: params.name,
        }}
      />
      <Text
        onPress={() => {
          router.setParams({ name: "Updated" });
        }}
      >
        Update the title
      </Text>
    </View>
  );
}
```
