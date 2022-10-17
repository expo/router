---
title: Layout Routes
sidebar_position: 3
---

To render shared navigation elements like a header, tab bar, or drawer, you can use a **Layout Route**.
If a **directory** contains a file named `_layout.js`, it will be used as the layout component for all the sibling files in the directory.

```bash title="File System"
app/
  # highlight-next-line
  _layout.js # A Layout Route for the sibling routes.
  home.js # A child route of `_layout.js`
```

If a nested route does not have a Layout Route then the **Child Route** name will include the directories leading up to it:

```bash title="File System"
app/
  stack/ # Contains no `_layout.js`
    # highlight-next-line
    home.js # Name is "stack/home"
```

The `Screen` options will also be applied to the nearest Layout Route.

<details>
  <summary>Deprecated</summary>

During the Beta, Layout Routes were defined by creating a file outside the directory with the same name as the directory. This is no longer supported.

</details>

<details>
  <summary>Interoperability</summary>

Nested routes are used to implement nested navigation in [React Navigation](https://reactnavigation.org/docs/nesting-navigators).

This convention is analogous to [nested routing](https://remix.run/docs/en/v1/guides/routing#what-is-nested-routing) (same format) in Remix.
Layout routes are also similar to `pages/_app.js` in Next.js.

</details>

## Fragment Routes

![](./assets/fragment-routes.png)

Fragment routes add nested layout without appending any path segments. Think of them like `index.js` but as a layout. These are most commonly used for adding navigators like tab, stack, drawer, etc... The format is `/(name)`, the `name` is purely cosmetic and not provided to the route component.

```bash title="File System"
app/
  stack/
    home.js # 𝝠.com/stack/home

app/
  # highlight-next-line
  (stack)/
    home.js # 𝝠.com/home
```

Both of these will render:

```xml
<App>
  <Stack>
    <Home />
  </Stack>
</App>
```

Be careful when using parallel fragment routes as they can create conflicting matches. For example, the following routes will conflict:

```bash title="File System"
app/
# highlight-next-line
  profile.js # Matches /profile
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
