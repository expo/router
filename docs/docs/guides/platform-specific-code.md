---
title: Platform Specific Code
---

While building your app, you may want to show specific content based on the current platform. Ideally, apps would have full feature parity across platforms, but this often isn't the case due to external design and business requirements. There are a few ways to achieve this in Expo Router.

### Platform module

You can use the [`Platform`](https://reactnative.dev/docs/platform-specific-code#platform-module) module from React Native to detect the current platform and render the appropriate content based on the result. For example, you can render a `Tabs` layout on mobile and a `Stack` layout on the web.

```tsx title="app/_layout.js"
import { Platform } from 'react-native';
import { Stack, Tabs } from 'expo-router';

export default function Layout() {
  const PlatformNavigator = Platform.OS === "web" ? Stack : Tabs;
  return (
    <PlatformNavigator>
        <PlatformNavigator.Screen name="index" options={{ title: "Home" }} />
        <PlatformNavigator.Screen name="settings" options={{ title: "Settings" }} />
    </PlatformNavigator>
  );
}

```

### Platform specific extensions

Currently, Metro platform extensions (e.g. .ios.js, .native.ts) are not supported in the app directory. However, you can create platform specific files outside of the app directory, and use them from within the app directory.

Consider the following project:

```bash title="File System"
app/
  _layout.js
  index.js
  user/
    [id].js
components/
  UserPage.js
  UserPage.android.js
  UserPage.ios.js
```

Suppose the designs require you to build completely different user screens for each platform. In that case, you can create a component for each platform in the `components/` directory, and Metro will import the correct version of the component. You can then re-export the the component as the screen in the app directory.

```tsx title="app/user/[id].js"
import UserPage from "@components/UserPage";

export default UserPage;
```
