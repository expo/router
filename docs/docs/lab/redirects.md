---
title: Redirects
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

Expo Router provides offline (client-side) redirects on native which can be used to migrate users from old URLs to new ones. Server-side redirects for web are still in development.

<!-- TODO: Update -->

## Setup

Redirects are configured in your `app.json` file.

```json title=app.json
{
  "expo": {
    "extra": {
      "router": {
        "redirects": [
          {
            "from": "/old",
            "to": "/new"
          }
        ]
      }
    }
  }
}
```

### Redirect Object

> All strings use [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) for matching. This means you can use the same syntax (glob / regex) as [Express](https://expressjs.com/en/guide/routing.html#route-paths).

- `from` **`string`** - The path to redirect from.
- `to` **`string`** - The path to redirect to. This can also be an external URL like `https://expo.dev`.
- `has` **`Matchable[] | undefined`** - An optional array of matchable attributes to check for. All attributes must be present for the redirect to match.
- `missing` **`Matchable[] | undefined`** - An optional array of matchable attributes to check for. All attributes must be missing for the redirect to match.

### Matchable Attributes

- `type` **`"query" | "header"`** - The type of attribute to match, only `query` is supported on native.
- `key` **`string`** - The key of the attribute to match. For example, if you want to match the `?foo=bar` query parameter, the key would be `foo`.
- `value` **`string`** - The value of the attribute to match. For example, if you want to match the `?foo=bar` query parameter, the value would be `bar`. If this is `undefined` then the attribute must be present, but the value is ignored.

## Examples

### External links

You can make a local path (e.g. `/source`) redirect to an external link:

```json title=app.json
{
  "expo": {
    "extra": {
      "router": {
        "redirects": [
          {
            "from": "/source",
            "to": "https://github.com/expo/router"
          }
        ]
      }
    }
  }
}
```

Now the following will link to GitHub:

```js title=app/index.js
import { Link } from "expo-router";

export default function Index() {
  return <Link to="/source">GitHub</Link>;
}
```

### User profile shortcuts

You may want to support matching usernames at the root of your app with `@`, e.g. `acme.app/@expo` -> `acme.app/users/expo`. This can be done with the following glob:

```json title=app.json
{
  "expo": {
    "extra": {
      "router": {
        "redirects": [
          {
            "from": "/@:username",
            "to": "/users/:username"
          }
        ]
      }
    }
  }
}
```

Now a link to `/@evanbacon` will redirect to `/users/evanbacon`.

<!-- TODO: Update -->

> This is generally performed with server-side `rewrites` (currently unsupported).
