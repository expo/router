---
title: Linking
sidebar_position: 4
---

The `expo-router` `Link` component supports client-side navigation to a route. It is similar to the `Link` component in `react-router-dom` and `next/link`.

When JavaScript is disabled or the client is offline, the `Link` component will render a regular `<a>` element. Otherwise, the default behavior will be intercepted and the client-side router will navigate to the route (faster and smoother).

Meaning you get the best of both worlds: a fast client-side navigation experience, and a fallback for when JavaScript is disabled or hasn't loaded yet.

```tsx
import { Link } from "expo-router";

<Link href="/">Home</Link>;
```

- Try to migrate as many: `navigation.navigate` calls to `Link` components. This will make your app faster and more accessible.
- Unlike `navigation.navigate`, `Link` components support relative paths like `/profile/settings`.

## Testing

On native, you can use the `uri-scheme` CLI to test opening native links on a device.

```bash
npx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```

You can also search for links directly in a browser like Safari or Chrome to test deep linking on physical devices.

- https://reactnavigation.org/docs/deep-linking
- https://reactnavigation.org/docs/configuring-links

## Dev mode

We currently inject a `/__index` file which provides a list of all routes in the app. This is useful for debugging and development. This screen is only injected during development, and won't be available in production.

We may remove this feature for the official release, but it's useful for now.
