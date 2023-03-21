---
title: Custom navigators
---

You can create your own custom navigators with the `Navigator` component.

### API

The `Navigator` component wraps the [`useNavigationBuilder`](https://reactnavigation.org/docs/custom-navigators#usenavigationbuilder) hook from React Navigation.

The return value of `useNavigationBuilder` can be accessed with the `Navigator.useContext()` hook from inside the `<Navigator />` component. Properties can be passed to `useNavigationBuilder` using the props of the `<Navigator />` component, this includes `initialRouteName`, `screenOptions`, `router`.

All of the `children` of a `<Navigator />` component will be rendered as-is.

- `Navigator.useContext`: Access the React Navigation `state`, `navigation`, `descriptors`, and `router` for the custom navigator.
- `Navigator.Slot`: A React component used to render the currently selected route. This component can only be rendered inside a `<Navigator />` component.

### Example

Custom layouts have an internal context that is ignored when using the `<Slot />` component without a `<Navigator />` component wrapping it.

```js
import { View } from "react-native";
import { TabRouter } from "@react-navigation/native";

import { Navigator, usePathname, Slot, Link } from "expo-router";

export default function App() {
  return (
    // highlight-next-line
    <Navigator router={TabRouter}>
      <Header />
      <Slot />
    </Navigator>
  );
}

function Header() {
  const { navigation, state, descriptors, router } = Navigator.useContext();

  const pathname = usePathname();

  return (
    <View>
      <Link href="/">Home</Link>
      <Link
        href="/profile"
        // Use `pathname` to determine if the link is active.
        // highlight-next-line
        style={[pathname === "/profile" && { color: "blue" }]}
      >
        Profile
      </Link>
      <Link href="/settings">Settings</Link>
    </View>
  );
}
```

> In `expo-router`, you currently need all layout routes to be a navigator. This is because we don't have a way to render a route without a parent navigator.
