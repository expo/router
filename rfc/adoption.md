# Adopting Expo Router

Expo router is a new, opinionated routing system for React Native apps. It's designed to be easy to use, and to be a good fit for most apps.

Expo router is built on our [React Navigation suite](https://reactnavigation.org/) making it easy to bring your existing React Navigation code to the new router.

## Navigators

Consider the following Tab navigator example from React Navigation:

```tsx
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="home" component={HomeScreen} />
        <Tab.Screen name="settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

In Expo router, this would be split across the file system:

```
app/
  (tab).tsx
  (tab)/
    home.tsx
    settings.tsx
```

The `app/(tab).tsx` file would look like this:

```tsx
// Import the pre-built tab layout from expo-router.
// This wraps the React Navigation tab navigator and adds support
// for linking and nesting children.
import { Tabs } from "expo-router";

export default function Layout() {
  // You can optionally specify the tab order with `order={['home', 'settings']}`.
  return <Tabs />;
}
```

The `app/(tab)/home.tsx` file would look like this:

```tsx
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
    </View>
  );
}
```

The `app/(tab)/settings.tsx` file would look like this:

```tsx
import { Text, View } from "react-native";

export default function Settings() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings</Text>
    </View>
  );
}
```

### Result

Unlike the React Navigation example, the Expo router example is split across the file system. This makes it easier to navigate the codebase and to find the code for a specific route. The Expo router example also has fully linking support out of the box, so you can use the same URLs in your app as you do in your web app.
