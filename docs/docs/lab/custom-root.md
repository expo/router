---
title: Custom Root HTML
---

When you statically render an Expo website, the root HTML element for each page can be customized by creating an `apps/+root.js` file that exports a default HTML component.

## Default Root

If an `app/+root.js` does not exist, then the default value will be used.

```js title=app/+root.tsx
import React from "react";
import { ScrollViewStyleReset } from "expo-router/root";

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- The `children` prop comes with the root `<div id="root" />` tag included inside.
- The JavaScript scripts are appended after the static render.
- React Native web styles are statically injected automatically.

## `expo-router/root`

The exports from `expo-router/root` are related to the Root HTML component.

- `ScrollViewStyleReset`: Root style-reset for full-screen React Native web apps with a root `<ScrollView />` should use the following styles to ensure native parity. [Learn more](https://necolas.github.io/react-native-web/docs/setup/#root-element).
