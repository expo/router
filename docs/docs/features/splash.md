---
title: Splash Screen
sidebar_position: 5
---

Splash screens are required on native platforms. Expo Router automatically orchestrates the native splash screen to keep it visible until the first route is rendered, this applies to any route that the user deep links into. To enable this functionality, install `expo-splash-screen` in your project.

The default behavior is to hide the splash screen when the first route is rendered, this is optimal for the majority of routes. For some routes, you may want to prolong the splash screen until additional data or asset loading has concluded. This can be achieved with the `SplashScreen` module from `expo-router`. If `SplashScreen.preventAutoHideAsync` is called before the splash screen is hidden, then the splash screen will remain visible until the `SplashScreen.hideAsync()` function has been invoked.

```js title=app/index.tsx
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => {
    // Perform some sort of async data or asset fetching.
    setTimeout(() => {
      SplashScreen.hideAsync();
      setReady(true);
    }, 1000);
  }, []);

  return (
    <>
      <Text>My App</Text>
    </>
  );
}
```
