---
title: Navigation Container
sidebar_position: 6
---

The global React Navigation [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/) is managed by Expo Router, you can pass it props like `theme` and `initialState` from any screen by using the `<RootContainer />` component.

```tsx title=app/home.tsx
import { RootContainer } from "expo-router";
import { DarkTheme } from "@react-navigation/native";

export default function Page() {
  return (
    <>
      {/* These props will be applied to the parent NavigationContainer. */}
      // highlight-next-line
      <RootContainer theme={DarkTheme} />
    </>
  );
}
```

> Avoid setting `children` or `linking` as these will break all automatic assumptions made by the router.

- Avoid using [`initialState`](https://reactnavigation.org/docs/navigation-container/#initialstate) as this is automatically handled by deep links (which Expo Router enables by default).
- Avoid using [`independent`](https://reactnavigation.org/docs/navigation-container/#independent) as this isn't automatically supported by the router.
<!-- - Avoid using [`fallback`](https://reactnavigation.org/docs/navigation-container/#fallback) as the container automatically uses the Splash Screen API to prevent white flashes. -->
- Use dynamic routes and 404 screens in favor of [`onUnhandledAction`](https://reactnavigation.org/docs/navigation-container/#onunhandledaction).
