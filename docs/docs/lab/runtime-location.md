---
title: window.location
---

> This guide refers to upcoming Expo Router features, all of which are experimental. You may need to [use Expo CLI on `main`](https://github.com/expo/expo/tree/main/packages/%40expo/cli#contributing) to use these features.

To support relative invocations that work both on the web and in native, across development and production, Expo Router polyfills the `window.location` API when needed. This can be used to access the current URL.

By default, the global `fetch` instance is polyfilled to support `window.location`, other networking APIs will need to be polyfilled manually, e.g. `<Image source={{ uri: location.origin + "/img.png" }} />`. We may polyfill these in the future to support more use cases.

## Setup

No setup is required on web, and no polyfill is needed.

### Native

In development, the `window.location` API is polyfilled to point to the development server. In production, the `window.location` API is polyfilled to point to the URL that your static assets are [hosted at](/docs/guides/hosting.md), this must be configured manually.

In order to polyfill in production, the field `extra.router.origin` in the `app.config.js` (or `app.json`) must be set to the URL that your static assets are [hosted at](/docs/guides/hosting.md).

```js title=app.config.js
module.exports = {
  extra: {
    router: {
      origin: "https://acme.com",
    },
  },
};
```

> Recommend using `app.config.js` to support dynamically swapping the URL before bundling.

You can host your `public/` directory and other public resources by deploying the expo website to a server that supports HTTPS. For instance, running `npx expo export && netlify deploy --dir dist --prod` will collect your resources and deploy them to netlify, **we plan to automate this in the future.** See the [hosting guide for more](/docs/guides/hosting.md).

> Public assets will not be bundled into your native app or available offline (with exception for network caching).

## Usage

The following example demonstrates how to use `window.location` to fetch a JSON file in the root `public/` directory.

```json title=public/hello.json
{
  "hello": "world"
}
```

In one of the routes, use the polyfilled `fetch` to fetch the JSON file.

```js title=app/index.js
import { Text } from "react-native";

export default function Page() {
  useEffect(() => {
    fetch("/hello.json", {})
      .then((res) => res.json())
      .then(console.log);
  }, []);

  return <Text>Hello World</Text>;
}
```

If you run this, you should see the following output in the console:

```json
{ "hello": "world" }
```

## Disable Polyfill

Setting the field `extra.router.origin: false` in the `app.config.js` (or `app.json`) will disable the `window.location` and `fetch` polyfills.

```json title=app.json
{
  "expo": {
    "extra": {
      "router": {
        "origin": false
      }
    }
  }
}
```
