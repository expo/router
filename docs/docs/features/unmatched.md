---
title: Unmatched Routes
sidebar_position: 8
---

Native apps don't have a server so there are technically no 404s. However, if you're implementing a router universally, then it makes sense to handle missing routes. This is done automatically for each app, but you can also customize it.

You can elevate the not found screen to a top-level route by adding a `Unmatched` component to your app in a [**deep dynamic route**](/docs/features/routes#deep-dynamic-routes):

```tsx title=app/[...unmatched].js
import { Unmatched } from "expo-router";

export default Unmatched;
```

This will render the default `Unmatched`. You can export any component you want to render instead. We recommend having a link to `/` so users can navigate back to the home screen.
