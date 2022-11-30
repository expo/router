---
title: Shared Routes
---

When a screen can appear simultaneously in multiple places, it's useful to share the same URL definition. For example, a tweet may show on multiple tabs of the twitter app, but it should only have one URL.

Expo Router supports this by allowing routes to be defined in multiple places. The first match wins.

```bash title="File System"
app/
  _layout.js # Tab bar
  (home)
    index.js # Matches `/`
  (profile)
    index.js # Also matches `/`
```

Both tabs will render the URL `/` but deep linking to `/` will go to the `app/(home)/index.js` route.

## Cloning

Most of the time, you'll want all routes to be push-able from all tabs at any time. This can quickly become tedious to maintain. To make this easier, you can use the cloned group syntax to clone routes multiple times:

```bash title="File System"
app/
  _layout.js # Tab bar
  (home, profile)
    index.js # Matches `/`
```

This will duplicate the group multiple times in-memory when accessed. Effectively this is the same as:

```bash title="File System"
app/
  _layout.js # Tab bar
  (home)
    index.js # Matches `/`
  (profile)
    index.js # Also matches `/`
```

In order to differentiate between the two, you can use the `segment` prop to determine which segment is currently being rendered:

```bash title="File System"
app/
  _layout.js # Tab bar
  (home, profile)
    _layout.js
    feed.js
    user.js
```

Now we'll choose a different initial route based on the `segment` being rendered:

```js title="app/(home, profile)/_layout.js"
import { Stack } from "expo-router";

const initialRoute = {
  "(home)": "feed",
  "(profile)": "user",
};

export default function StackLayout({ segment }) {
  return (
    <Stack>
      <Stack.Screen name={firstRoute[segment]} />
    </Stack>
  );
}
```

## Linking

When linking, you can use `./screen` to move to a route matching `screen` in the same group. When using the absolute syntax `/screen` the app will navigate to the first matching route in the entire app.

You can also use the absolute syntax `/(group)/screen` to navigate to a specific group. The `/(group)` will be omitted automatically.

> All routes in Expo Router have unique URLs so you can always link to a specific route. Simply keep the fragment segments in the URL.
