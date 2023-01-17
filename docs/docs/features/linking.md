---
title: Linking
sidebar_position: 2
---

Use the `<Link />` component to navigate between pages. This is conceptually similar to the `<a>` element in HTML.

```js
// highlight-next-line
import { Link } from "expo-router";

export default function Page() {
  return (
    <View>
      {/* highlight-next-line */}
      <Link href="/">Home</Link>
    </View>
  );
}
```

- `href` accepts relative paths like `../settings` or full paths like `/profile/settings`. Relative paths are useful for shared routes.
- `href` can also accept an object like `{ pathname: 'profile', params: { id: '123' } }` to navigate to dynamic routes.
- Use the `replace` prop to replace the current route in the history instead of pushing a new route.

## `useRouter`

For more advanced use cases, you can use the imperative `useRouter()` hook to navigate imperatively.

```js
import { View, Text } from "react-native";
// highlight-next-line
import { useRouter } from "expo-router";

export default function Page() {
  // highlight-next-line
  const router = useRouter();

  return (
    <View>
      <Text
        onPress={() => {
          // highlight-next-line
          router.push("/profile/settings");
        }}
      >
        Settings
      </Text>
    </View>
  );
}
```

- **push**: _`(href: Href) => void`_ Navigate to a route. You can provide a full path like `/profile/settings` or a relative path like `../settings`. Navigate to dynamic routes by passing an object like `{ pathname: 'profile', params: { id: '123' } }`.
- **replace**: _`(href: Href) => void`_ Same API as `push` but replaces the current route in the history instead of pushing a new one. This is useful for redirects.
- **back**: _`() => void`_ Navigate to a route. You can provide a full path like `/profile/settings` or a relative path like `../settings`. Navigate to dynamic routes by passing an object like `{ pathname: 'profile', params: { id: '123' } }`.
- **setParams**: _`(params: Record<string, string>) => void`_ Update the query params for the currently selected route.

### `Href` type

The `Href` type is a union of the following types:

- **string**: A full path like `/profile/settings` or a relative path like `../settings`.
- **object**: An object with a `pathname` and optional `params` object. The `pathname` can be a full path like `/profile/settings` or a relative path like `../settings`. The `params` can be an object of key/value pairs.

## `usePathname`

Returns the currently selected route location without search parameters. e.g. `/acme?foo=bar` -> `/acme`. Segments will be normalized: `/[id]?id=normal` -> `/normal`

> `/profile/baconbrix?extra=info`

```js title=app/profile/[user].tsx
import { Text } from "react-native";
// highlight-next-line
import { usePathname } from "expo-router";

export default function Route() {
  // highlight-next-line
  const pathname = usePathname();
  // pathname = "/profile/baconbrix"
  return <Text>User: {user}</Text>;
}
```

## `useSearchParams`

Returns the URL search parameters for the currently selected route. e.g. `/acme?foo=bar` -> `{ foo: "bar" }`.

> `/profile/baconbrix?extra=info`

```js title=app/profile/[user].tsx
import { Text } from "react-native";
import { useSearchParams } from "expo-router";

export default function Route() {
  // highlight-next-line
  const { user, extra } = useSearchParams();
  return <Text>User: {user}</Text>;
}
```

Given a route at `app/profile/[id].tsx` if the hook is called while the URL is `/profile/123`, the results of `useSearchParams` would be as follows:

```js
{
  id: "123";
}
```

## `useSegments`

Returns a list of segments for the currently selected route. Segments are not normalized, so they will be the same as the file path. e.g. `/[id]?id=normal` -> `["[id]"]`

```js title=app/profile/[user].tsx
import { Text } from "react-native";
// highlight-next-line
import { useSegments } from "expo-router";

export default function Route() {
  // highlight-next-line
  const segments = useSegments();
  // segments = ["profile", "[user]"]
  return <Text>Hello</Text>;
}
```

## `useNavigation`

Access the underlying React Navigation [`navigation` prop](https://reactnavigation.org/docs/navigation-prop) to imperatively access layout-specific functionality like `navigation.openDrawer()` in a Drawer layout. [Learn more](https://reactnavigation.org/docs/navigation-prop/#navigator-dependent-functions).

```js
// highlight-next-line
import { useNavigation } from "expo-router";

export default function Route() {
  // highlight-next-line
  const navigation = useNavigation();
  return (
    <View>
      <Text
        onPress={() => {
          // highlight-next-line
          navigation.openDrawer();
        }}
      >
        Open Drawer
      </Text>
    </View>
  );
}
```

## Redirect

You can immediately redirect from a particular screen by using the `Redirect` component:

```js
import { View, Text } from "react-native";
// highlight-next-line
import { Redirect } from "expo-router";

export default function Page() {
  // Some logic to determine if the user is logged in.
  const { user } = useAuth();

  if (!user) {
    // Redirect to the login screen if the user is not authenticated.
    // highlight-next-line
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>Welcome Back!</Text>
    </View>
  );
}
```

You can also redirect imperatively using the `useRouter` hook:

```js
import { Text } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

function MyScreen() {
  const router = useRouter();

  useFocusEffect(() => {
    // Call the replace method to redirect to a new route without adding to the history.
    // We do this in a useFocusEffect to ensure the redirect happens every time the screen
    // is focused.
    router.replace("/profile/settings");
  });

  return <Text>My Screen</Text>;
}
```

## Testing

On native, you can use the [`uri-scheme`](https://www.npmjs.com/package/uri-scheme) CLI to test opening native links on a device.

For example, if you want to launch the Expo Go app on iOS to the `/form-sheet` route, you can run:

> Replace `192.168.87.39:19000` with the IP address shown when running `npx expo start`.

```bash
npx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```

You can also search for links directly in a browser like Safari or Chrome to test deep linking on physical devices. Learn more about [testing deep links](https://reactnavigation.org/docs/deep-linking).

## Sitemap

![](/img/directory.png)

We currently inject a `/_sitemap` file which provides a list of all routes in the app. This is useful for debugging and development. This screen is only injected during development, and won't be available in production.

We may remove this feature for the official release, but it's useful for now.
