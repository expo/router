---
title: Linking
sidebar_position: 2
---

The `expo-router` `Link` component supports client-side navigation to a route. It is similar to the `Link` component in `react-router-dom` and `next/link`.

When JavaScript is disabled or the client is offline, the `Link` component will render a regular `<a>` element. Otherwise, the default behavior will be intercepted and the client-side router will navigate to the route (faster and smoother).

Meaning you get the best of both worlds: a fast client-side navigation experience, and a fallback for when JavaScript is disabled or hasn't loaded yet.

```tsx
import { Link } from "expo-router";

export default function Page() {
  return (
    <View>
      <Link href="/">Home</Link>
    </View>
  );
}
```

- Try to migrate as many: `navigation.navigate` calls to `Link` components. This will make your app faster and more accessible.
- Unlike `navigation.navigate`, the `Link` component supports using full paths like `/profile/settings`. This same link could be implemented imperatively using `navigation.navigate('profile', { screen: 'settings' })`

## Imperative API

Use the [`navigation` object](https://reactnavigation.org/docs/navigation-prop) from React Navigation to imperatively navigate:

```js
export default function Route({ navigation }) {
  return (
    <View>
      <Text
        onPress={() => {
          // Go back to the previous screen using the imperative API.
          navigation.goBack();
        }}
      >
        Details Screen
      </Text>
    </View>
  );
}
```

Alternatively, you can access the `navigation` prop from any component using the hook:

```js
import { useNavigation } from "@react-navigation/native";

function MyBackButton() {
  const navigation = useNavigation();

  return <Button title="Go back" onPress={() => navigation.goBack()} />;
}
```

## Testing

On native, you can use the `uri-scheme` CLI to test opening native links on a device.

```bash
npx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```

You can also search for links directly in a browser like Safari or Chrome to test deep linking on physical devices. Learn more about [testing deep links](https://reactnavigation.org/docs/deep-linking).

## Dev mode

We currently inject a `/__index` file which provides a list of all routes in the app. This is useful for debugging and development. This screen is only injected during development, and won't be available in production.

We may remove this feature for the official release, but it's useful for now.
