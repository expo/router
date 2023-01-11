---
title: useNavigation
---

Expo Router exports a custom [`useNavigation`](https://reactnavigation.org/docs/use-navigation/) hook that optionally accepts a relative route fragment to access any parent `navigation` prop.

The format for the normalized path is `/folder/file` where the string always starts with a `/` and there is no file extension or trailing slash.

Consider the following structure:

```bash title="File System"
app/
  _layout.js
  tabs/
    _layout.js
    page.js
```

```tsx title=app/tabs/page.tsx
import { useNavigation } from "expo-router";

export default function Page() {
  // This navigation prop controls the direct parent `/tabs/_layout.js`.
  const navigation = useNavigation();
  // This navigation prop controls the direct parent `/_layout.js`.
  const rootNavigation = useNavigation("/");

  // ...
}
```

You can still access any parent `navigation` prop by using the [`navigation.getParent()`](https://reactnavigation.org/docs/navigation-prop/#getparent) function. Each layout automatically indexes itself using the normalized path.
