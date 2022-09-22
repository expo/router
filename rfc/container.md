# Navigation Container

The [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/) is managed by Expo router, you can pass it props like `theme` and `initialState` from any screen by using the `<ContextContainer />` component.

```tsx
// app/home.tsx

import { ContextContainer } from "expo-router";
import { DarkTheme } from "@react-navigation/native";

export default function Page() {
  return (
    <>
      {/* These props will be applied to the parent NavigationContainer. */}
      <ContextContainer theme={DarkTheme} />
    </>
  );
}
```

> Avoid setting `children` or `linking` as these will break all automatic assumptions made by the router.

- Avoid using [`independent`](https://reactnavigation.org/docs/navigation-container/#independent) as this isn't automatically supported by the router.
- Avoid using [`fallback`](https://reactnavigation.org/docs/navigation-container/#fallback) as the container automatically uses the Splash Screen API to prevent white flashes.
