---
title: Passing parameters to the routes
sidebar_position: 4
---

Ports the guide [React Navigation: Params](https://reactnavigation.org/docs/params) to Expo Router.

```bash title="File System"
app/
  _layout.js
  index.js
  details.js
```

```js title=app/_layout.js
import { Stack } from "expo-router";

export default function Layout() {
  return <Stack />;
}
```

```js title=app/index.js
import { useSearchParams } from "expo-router";

import { useEffect } from "react";
import { View, Text } from "react-native";

export default function Home() {
  const params = useSearchParams();

  const post = params.get("post");

  useEffect(() => {
    if (post) {
      // Post updated, do something with `post`
      // For example, send the post to the server
    }
  }, [post]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Link
        href={{
          pathname: "details",
          // /* 1. Navigate to the details route with query params */
          params: { id: 86, other: "anything you want here" },
        }}
      >
        Go to Details
      </Link>
    </View>
  );
}
```

```js title=app/details.js
import { View, Text } from "react-native";
import { useNavigation, useRouter, useSearchParams } from "expo-router";

export default function Details() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? 42;
  const other = params.get("other");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        onPress={() => {
          router.push({ pathname: "/", params: { post: "random", id, other } });
        }}
      >
        Go Home
      </Text>
    </View>
  );
}
```

## Notes

- Prefer static route support (ex: `href="/foo/bar?some=data"`) to [passing-params-to-nested-navigators](https://reactnavigation.org/docs/params#passing-params-to-nested-navigators)
- Only serialized top level params are supported https://reactnavigation.org/docs/params#what-should-be-in-params
