---
title: Routes
sidebar_position: 1
---

:::warning Beta Release

Expo Router is in the earliest stage of development. The API is subject to breaking changes. The documentation is incomplete and may be inaccurate. The project is not yet ready for production use. Please [contribute to the discussion](https://github.com/expo/router/discussions/1) if you have any ideas or suggestions on how we can improve the convention.

:::

The file system-based routing convention enables developers to structure their app in a logic and intuitive way. Expo Router uses this convention to optimize the app by generating native deep links and web routes automatically.

The convention is based on the concept of nesting routes inside each other to create shared UI elements like tab bars and headers across multiple children. This format should feel familiar to React developers.

## App directory

The root level `app/` directory is used to define all routes and screens in the app.

![](./assets/main.png)

<details>
  <summary>Interoperability</summary>

The app directory name could be customizable in the future, but that's not a priority as of now.

- The `app/` directory is similar to the:
- `app/routes/` directory in [Remix](https://remix.run/docs/en/v1/guides/routing#defining-routes).
- `pages/` directory in [Next.js](https://nextjs.org/docs/basic-features/pages).
- `src/routes/` directory in [SvelteKit](https://kit.svelte.dev/docs/routing).
- `app/` directory in the [Next.js layouts RFC](https://nextjs.org/blog/layouts-rfc#introducing-the-app-directory).

The entry file for classic Expo apps is `App.js`, the Expo config file is `app.json` (or `app.config.js`), and the Expo conference is called **App.js conf** so to keep things relatively consistent, the root directory is called `app/`. Luckily, most web frameworks are also using `app/` so it aligns well. This does mean you'll need a monorepo if you want to use Expo and another framework in the same repo.

</details>

# Routes

Routes are defined as files in the `app/` directory that export a React component as _default_. The file path is the route path.

```bash title="File System"
app/
  index.js # Matches: 𝝠.com/
  home.js # Matches: 𝝠.com/home
  blog/posts.js # Matches: 𝝠.com/blog/posts
```

If you create a file `app/index.js`, this will become the first screen in your app.

```tsx title=app/index.js
import { Text } from "react-native";

export default function Page() {
  return <Text>First page</Text>;
}
```

- You can use extensions: `js`, `tsx`, `ts`, `tsx`. In a future iteration we will add support for any extension in the Metro config [`resolver.sourceExts`](https://facebook.github.io/metro/docs/configuration#sourceexts).
- Any path in the `app/` directory can be used as a root path. There are no global root paths.
- Platform extensions like `.ios.js` or `.native.ts` are not currently supported in the `app/` directory.

## Index Routes

```bash title="File System"
app/
   # highlight-next-line
  index.js # Matches: 𝝠.com/
    home/
     # highlight-next-line
      index.js # Matches: 𝝠.com/home/
```

- If a route is named `./index.js`, it will add both `index` and `/` to the route, effectively acting as a [fragment route](/router/docs/features/layout-routes/#fragment-routes).
- Directories cannot be named `/index/`. The filename `/index.js` is reserved for leaf routes.

<details>
  <summary>Interoperability</summary>

Index routes are based on the original `index.html` system from the Tim Berners-Lee/Apache HTTP Server days.

</details>

## Glossary

- **Slug** A dynamic URL path segment.
- **Child route** A route that has no nested children, it shows up at the end of a URL.
- [**Dynamic routes**](/router/docs/features/dynamic-routes) A route that has a variable path segment.
- [**Layout routes**](/router/docs/features/layout-routes) A route with nested children.
- [**Fragment routes**](/router/docs/features/layout-routes#fragment-routes) A layout route that does not add a path segment.
