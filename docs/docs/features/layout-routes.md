---
title: Layout Routes
sidebar_position: 3
---

:::warning Beta Release

Expo Router is in the earliest stage of development. The API is subject to breaking changes. The documentation is incomplete and may be inaccurate. The project is not yet ready for production use. Please [contribute to the discussion](https://github.com/expo/router/discussions/1) if you have any ideas or suggestions on how we can improve the convention.

:::

To render shared navigation elements like a header, tab bar, or drawer, you can use a **layout route**.
If a **route** has a sibling directory by the same name, it will be used as the layout component for all the files in the respective directory.

```bash title="File System"
app/
# highlight-next-line
  stack.js # Layout route. This is where a header bar would go
  # highlight-next-line
  stack/ # Children of stack.js
    home.js # A child route of stack.js
```

If a nested route does not have a layout route then a virtual, unstyled navigator will be generated in-memory to accommodate the child route:

```bash title="File System"
app/
  stack/ # Unpaired layout route
    home.js # Child route of a virtual navigator

# highlight-next-line
  stack.tsx # This file exists in-memory to render the `stack/home.js` route. Creating this file will override the in-memory route.
```

The virtual route system exists to accommodate native navigation which requires a parent navigator to render a child route.

<details>
  <summary>Interoperability</summary>

Nested routes are used to implement nested navigation in [React Navigation](https://reactnavigation.org/docs/nesting-navigators).

This convention is analogous to [nested routing](https://remix.run/docs/en/v1/guides/routing#what-is-nested-routing) (same format) in Remix.
Layout routes are also similar to `pages/_app.js` in Next.js.

</details>

## Fragment Routes

![](./assets/fragment-routes.png)

Fragment routes add nested layout without appending any path segments. Think of them like `index.js` but as a layout. These are most commonly used for adding navigators like tab, stack, drawer, etc... The format is `(name).js` and `/(name)`, the `name` is purely cosmetic and not provided to the route component.

```bash title="File System"
app/
  layout.js # Layout route
  layout/
    home.js # 𝝠.com/layout/home

app/
# highlight-next-line
  (layout).js # Fragment route
  # highlight-next-line
  (layout)/
    home.js # 𝝠.com/home
```

Both of these will render:

```xml
<App>
  <Layout>
    <Home />
  </Layout>
</App>
```

Be careful when using parallel fragment routes as they can create conflicting matches. For example, the following routes will conflict:

```bash title="File System"
app/
# highlight-next-line
  profile.js # Matches /profile
  (layout).js
  (layout)/
  # highlight-next-line
    profile.js # Matches /profile (conflict)
```

Expo Router will assert when there are route collisions.

The name 'Fragment' route is a nod to [React Fragments](https://reactjs.org/docs/fragments.html) (`<>{...}</>`) which wrap components without adding any additional views to the hierarchy.

<details>
  <summary>Previous iteration</summary>

We originally considered using `index/` instead of `(index)/` since the leaf variation is automatically collapsed. This was rejected because `/index/index` was not a valid path for fragments but it was for leaf routes. Theoretically we should also be able to support multiple fragments in a single directory for swapping parent layouts.

</details>

<details>
  <summary>Interoperability</summary>

The Fragment convention is similar to:

- Groups in [SvelteKit](https://kit.svelte.dev/docs/advanced-routing#advanced-layouts-group) (`(group)`).
- [pathless layout routes](https://remix.run/docs/en/v1/guides/routing#pathless-layout-routes) in Remix (`__group`)
- [Route Groups](https://nextjs.org/blog/layouts-rfc#route-groups) in the upcoming Next.js layouts RFC (`(group)`).

</details>
