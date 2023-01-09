---
title: Link
sidebar_position: 1
---

The Expo Router `Link` component is a wrapper around the React Navigation `Link` component. It is used to navigate to a route using a declarative API.

## `to`

Instead of the [`to`](https://reactnavigation.org/docs/use-link-props#to) property, Expo Router uses the `href` property.

```tsx
import { Link } from "expo-router";

function MyLink() {
  return (
    <>
      <Link href="/path">Go to path</Link>
      <Link href={{ pathname: "/[user]", params: { user: "evanbacon" } }}>
        Go to user
      </Link>
    </>
  );
}
```

## `action`

Expo Router supports a subset of the [`action`](https://reactnavigation.org/docs/use-link-props#action) property, with the `replace` property. For other actions such as `GO_BACK`, use the `useRouter` hook.
