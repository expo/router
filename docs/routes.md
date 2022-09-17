# Routes

Routes are defined as files in the `app/` directory. The file name is the route path, and the file exports a React component that renders the page.

```
- app/
  - index.js
```

```tsx
// index.js
import { Text } from "react-native";

export default function Page() {
  return <Text>First page</Text>;
}
```

- Any path in the `app/` directory can be used as a root path.
- You can use extensions: `js`, `tsx`, `ts`, `tsx`. In a future iteration we will add support for any extension in the Metro config [`resolver.sourceExts`](https://facebook.github.io/metro/docs/configuration#sourceexts).
- Platform extensions like `.ios.js` or `.native.ts` are not currently supported in the `app/` directory.

<details>
  <summary>Interoperability</summary>

The routes convention is:

- Most closely related to the routes system in Remix.
- Similar to the [pages API](https://nextjs.org/docs/basic-features/pages) in Next.js but with the added nested functionality, effectively Remix.
- The routes convention is the largest departure from the Next.js Layouts RFC.

</details>

## Nested Routes

To render shared navigation elements like a header, tab bar, or drawer, you can use a nested route. If a directory name matches a file name, then the matching routes can be nested.

```
- app/
  - (stack).js
  - (stack)/
    - home.js -- This component is provided to `app/(stack).js` to be nested in the UI.
```

<details>
  <summary>Interoperability</summary>

Nested routes are used to implement nested navigation in [React Navigation](https://reactnavigation.org/docs/nesting-navigators).

This convention is analogous to [nested routing](https://remix.run/docs/en/v1/guides/routing#what-is-nested-routing) (same format) in Remix, `pages/_app.js` in Next.js, and [Layouts](https://nextjs.org/blog/layouts-rfc#layouts) (`folder/layout.js`) in the Next.js layouts RFC.

</details>

## Leaf Routes

A leaf route refers to a route that has no nested children, it shows up at the end of a URL.

## Fragment Routes

Fragment routes add nested layout without appending any path segments. These are most commonly used for adding navigators like tab, stack, drawer, etc...

The format is `(name).js` and `/(name)`. The name currently serves no purpose other than to distinguish various fragment routes.

For example:

```
- app/
  - profile.js -- Matches /profile with: profile.js
  - (layout).js
  - (layout)/
    - home.js -- Matches /home with: (layout).js > home.js
  - (alternate).js
  - (alternate)/
    - settings.js -- Matches /settings with: (alternate).js > settings.js
```

The issue with this feature is that it's a bit harder to reason about the routes at a glance. This feature also makes it possible to create conflicting routes like:

```
- app/
  - profile.js -- Matches /profile
  - (layout).js
  - (layout)
    - profile.js -- Matches /profile (conflict)
```

Expo router will assert when there are route collisions.

The name 'Fragment' route is a nod to [React Fragments](https://reactjs.org/docs/fragments.html) (`<>{...}</>`) which wrap components without adding any additional views to the hierarchy.

**Rejected**

We originally considered using `index/` instead of `(index)/` since the leaf variation is automatically collapsed. This was rejected because `/index/index` was not a valid path for fragments but it was for leaf routes. Theoretically we should also be able to support multiple fragments in a single directory for swapping parent layouts.

<details>
  <summary>Interoperability</summary>

The Fragment convention is similar to:

- Groups in [SvelteKit](https://kit.svelte.dev/docs/advanced-routing#advanced-layouts-group) (`(group)`).
- [pathless layout routes](https://remix.run/docs/en/v1/guides/routing#pathless-layout-routes) in Remix (`__group`)
- [Route Groups](https://nextjs.org/blog/layouts-rfc#route-groups) in the upcoming Next.js layouts RFC (`(group)`).

The format is the same as SvelteKit/upcoming Next.js but the implementation and usage is a bit different.

</details>

## Index Routes

- If a route is named `./index.js`, it will add both `index` and `/` to the route, effectively acting as a [fragment route](#fragment-routes).
- Directories cannot be named `/index/`. The filename `/index.js` is reserved for [leaf routes](#leaf-routes).
- An index route cannot be at the same level as a [fragment route](#fragment-routes) as they'd both match `/`.

Index routes are based on the original `index.html` system from the Tim Berners-Lee/Apache HTTP Server days. The idea is that if you visit a directory, you'll see a list of all the available files by default making it easy to navigate the site in development. Users could then override the default behavior by creating an `index.html` file to provide a better navigation experience.

To that end, if you visit a directory in Expo, you'll see a list of all the available files. If you visit a directory in Expo that has an `index.js` or nested parent route, you'll see the rendered page instead.

> Learn more in this ancient [blog post](https://www.w3.org/Provider/Style/URI.html#dirindex), or this one from [Apache](https://httpd.apache.org/docs/2.4/mod/mod_dir.html#directoryindex).

## Dynamic Routes

Dynamic routes are routes that have a variable part. For example, `/blog/post/[id]` is a dynamic route. The variable part (`[id]`) is called a "slug". The slug is the part of the URL that is dynamic. The slug is defined by the file name. For example, `/blog/post/bacon` is defined by the file `/blog/post/[id].tsx`.

- `[id].js` will match `/blog/1` and `/blog/2` and provide the query `{ id: 1 }` and `{ id: 2 }` respectively.

Routes with higher specificity will be matched first. For example, `/blog/bacon` will match `blog/bacon.js` before `blog/[id].js`.

<details>
  <summary>Interoperability</summary>

> By [popular demand](https://twitter.com/Baconbrix/status/1567538444246589441), the dynamic routes pattern is based on the [Next.js dynamic routes](https://nextjs.org/docs/routing/dynamic-routes) system.

There are a couple different ways to implement dynamic routes, here are some existing formats:

| Format              | Framework        |
| ------------------- | ---------------- |
| `/blog/[id].js`     | Next.js          |
| `/blog/[id].svelte` | SvelteKit        |
| `/blog/$id.js`      | Remix            |
| `/blog/:id.js`      | React Navigation |

> The React Navigation version is an implementation detail and not used for the route name.

Due to my indifference, I had a [Twitter poll](https://twitter.com/Baconbrix/status/1567538444246589441) to decide on the format. The winner was `/blog/[id].js`. The runner-up was a made up format `*.js`, and last was the Remix style.

**Related**

- [Redwood cells](https://redwoodjs.com/docs/cells)
- [Remix](https://remix.run/docs/en/v1/routing/file-system-routing)
- [`react-router`](https://reactrouter.com/web/guides/quick-start)
- [Next.js layouts RFC, pt. 1](https://nextjs.org/blog/layouts-rfc)

</details>

## Deep Dynamic Routes

Similar to dynamic routes, but the slug matches any number of path components in a route. For example, `/blog/post/[...id]` is a deep dynamic route. The variable part (`[...id]`) is called a "slug". The slug is the part of the URL that is dynamic. The slug is defined by the file name. For example, `/blog/post/bacon/cheese` is defined by the file `/blog/post/[...id].tsx`.

- `[...ids].js` will match `/blog/1/2/3` and provide the query `{ ids: [1, 2, 3] }`.

<details>
  <summary>Interoperability</summary>

This convention is functionally analogous to the 'optional catch-all dynamic routes' (`[[...id]].js`) feature from Next.js but the syntax is different. Unlike Next.js which has a separate syntax for matching everything except index, Expo uses the same syntax for both. If you want to match everything except index, you can implement an `index.js` file that has custom handling. We also reserve the term **catch** for error handling.

</details>

## Unmatched Routes

Unmatched routes are routes that don't match any other routes. They are used to render a 404 page.

## App directory

All routes are defined in the `app/` directory. The `app/` directory is a special directory that is used to define routes. The `app/` directory is a sibling to the `node_modules/` directory.

<details>
  <summary>Interoperability</summary>

- The `app/` directory is similar to the:
- `app/routes/` directory in [Remix](https://remix.run/docs/en/v1/guides/routing#defining-routes).
- `pages/` directory in [Next.js](https://nextjs.org/docs/basic-features/pages).
- `src/routes/` directory in [SvelteKit](https://kit.svelte.dev/docs/routing).
- `app/` directory in the [Next.js layouts RFC](https://nextjs.org/blog/layouts-rfc#introducing-the-app-directory).

</details>
