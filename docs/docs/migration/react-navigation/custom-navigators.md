---
title: Custom navigators
---

You can create your own custom navigators with the `Layout` component.

### API

The `Layout` component wraps the [`useNavigationBuilder`](https://reactnavigation.org/docs/custom-navigators#usenavigationbuilder) hook from React Navigation.

The return value of `useNavigationBuilder` can be accessed with the `Layout.useContext()` hook from inside the `<Layout />` component. Properties can be passed to `useNavigationBuilder` using the props of the `<Layout />` component, this includes `initialRouteName`, `screenOptions`, `router`.

All of the `children` of a `<Layout />` component will be rendered as-is.

- `Layout.useContext`: Access the React Navigation `state`, `navigation`, `descriptors`, and `router` for the custom navigator.
- `Layout.Children`: A React component used to render the currently selected route. This component can only be rendered inside a `<Layout />` component.

### Example

Custom layouts have an internal context that is ignored when using the `<Children />` component without a `<Layout />` component wrapping it.

```tsx
import { View } from "react-native";
import { TabRouter } from "@react-navigation/native";

import { Layout, usePathname, Children, Link } from "expo-router";

export default function App() {
  return (
    // highlight-next-line
    <Layout router={TabRouter}>
      <Header />
      <Children />
    </Layout>
  );
}

function Header() {
  const { navigation, state, descriptors, router } = Layout.useContext();

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
