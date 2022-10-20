---
title: Tabs
---

Expo Router adds an additional `href` screen option which can only be used with screen options that are an object (e.g. `screenOptions={{ href: "/path" }}`) and cannot be used simultaneously with `tabBarButton`.

## Hiding a tab

Sometimes you want a route to exist but not show up in the tab bar, you can pass `href: null` to disable the button:

```js
<Tabs.Screen
  // Name of the route to hide.
  name="index"
  options={{
    // This tab will no longer show up in the tab bar.
    href: null,
  }}
/>
```

## Dynamic routes

You may want to use a dynamic route in your tab bar (for example a profile tab). For this case, you'll want the button to always link to a specific href.

```js
import { Link, Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        // Name of the dynamic route.
        name="[user]"
        options={{
          // Ensure the tab always links to the same href.
          href: "/evanbacon",

          // OR you can use the Href object:
          href: {
            pathname: "/[user]",
            params: {
              user: "evanbacon",
            },
          },
        }}
      />
    </Tabs>
  );
}
```
