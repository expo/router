# Routes

Routes are defined as files in the `app/` directory. The file name is the route path, and the file exports a React component that renders the page.

```
- app/
  - index.js
  - index/
    - home.js
    - profile.js
```

- The root path is `app/index.js` - universal root component. Think of this like the `pages/_document.js` in Next.js or the `app/route.js` in Remix.
- You can use extensions: `js`, `tsx`, `ts`, `tsx`.
<!-- - Platform extensions like `.ios.js` or `.native.ts` are not supported in the `app/` directory. -->

## Index Routes

If a file or directory is named `index`, it will not add a new path segment to the route.

## Nested Routes

To render shared navigation elements like a header, tab bar, or drawer, you can use a nested route. If a directory name matches a file name, then the matching routes can be nested.

```
- app/
  - index.js
  - index/
    - home.js -- This component is provided to `app/index.js` to be nested in the UI.
```

## Dynamic Routes

Dynamic routes are routes that have a variable part. For example, `/blog/post/[id]` is a dynamic route. The variable part (`[id]`) is called a "slug". The slug is the part of the URL that is dynamic. The slug is defined by the file name. For example, `/blog/post/bacon` is defined by the file `/blog/post/[id].tsx`.

> By [popular demand](https://twitter.com/Baconbrix/status/1567538444246589441), the dynamic routes pattern is based on the [Next.js dynamic routes](https://nextjs.org/docs/routing/dynamic-routes) system.

- `[id].js` will match `/blog/1` and `/blog/2` and provide the query `{ id: 1 }` and `{ id: 2 }` respectively.
- `[...ids].js` will match `/blog/1/2/3` and provide the query `{ ids: [1, 2, 3] }`. This is known as a "catch-all route".
- `[[...ids]].js` will match `/blog/1/2/3` and the unmatched `/blog/` and provide the query `{ ids: [1, 2, 3] }` and `{ ids: undefined }` respectively. This is known as an "optional catch-all route".

Routes with higher specificity will be matched first. For example, `/blog/bacon` will match `blog/bacon.js` before `blog/[id].js`.

<details>
  <summary>Format reasoning</summary>

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
