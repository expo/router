---
title: Server
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

Expo Router supports enables you to write universal backend server code directly in your app.

```
EXPO_USE_ROUTE_HANDLERS=1 npx expo
```

- The environment variable `EXPO_USE_ROUTE_HANDLERS` must be enabled while route handlers are in beta.
- Server features require a custom Node.js server to work.

## Route Handlers

> While in beta, server code may leak into the client bundle. This won't happen in the stable release.

Route handlers are functions that are executed when a route is matched. They can be used to securely handle sensitive data, such as API keys, or to implement custom server logic.

Route Handlers are defined by creating files in the `app` directory with the `+api.js` extension. For example, the following route handler will be executed when the route `/api/hello` is matched.

```js title=app/api/hello+api.ts
import { Request, Response } from "expo-router/server";

export function GET(request: Request) {
  return Response.json({ hello: "world" });
}
```

You can export any of the following functions `GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS` from a route handler. The function will be executed when the corresponding HTTP method is matched.

To access the data, you can make a network request to the route. For example, the following code will make a request to the route handler above.

```js
async function fetchHello() {
  const response = await fetch("/api/hello");
  const data = await response.json();
  console.log(data);
}
```

This won't work by default on native as `/api/hello` does not provide an origin URL. You can define an origin URL by setting `expo.router.url` in `app.json` or `app.config.js`.

```json
{
  "expo": {
    "router": {
      "url": "https://example.com"
    }
  }
}
```

This will polyfill the `fetch` method to use the baseUrl. Note that this doesn't account for all native network requests, such as `Image.prefetch` or `Image.getSize`. Report unsupported network requests as an issue.
