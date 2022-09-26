---
title: URLs
---

You can use the `useCurrentRoute` hook to get the virtual URL in-app. This is similar to the `window.location` API in the browser.

```tsx
import { useCurrentRoute } from "expo-router";

export default function Page() {
  const route = useCurrentRoute();

  return (
    <View>
      <Text>
        Current URL: {route.pathname} {route.query}
      </Text>
    </View>
  );
}
```

- `pathname`: The path of the URL, e.g. `/profile/settings` with the query string removed.
- `query`: The query string as an object, e.g. `{ id: "123" }`.
