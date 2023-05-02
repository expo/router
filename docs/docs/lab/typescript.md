---
title: TypeScript
# TODO
sidebar_class_name: hidden
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

Expo Router provides an integrated TypeScript experience. To get started:

- Install TypeScript either by `yarn -D typescript` or `npm i -D typescript`
- Run `npx tsc --init` or `yarn tsc --init` to initialise TypeScript
- Set the environment variable `EXPO_USE_TYPED_ROUTER=true`

When enabled, Expo Router will automatically adjust your environment to ensure Expo Router types are picked up by the TypeScript compiler.

> If `EXPO_USE_TYPED_ROUTER` is removed, Expo Router will remove the changes it made

## Statically Typed Links

Expo Router will generate a link definition in `.expo/types` that contains information about existing routes in your application. This overrides Expo Router's generic `Href<T>` definition with a personalised declaration.

Components and functions that use `Href<T>` will now by statically typed and have a much stricter definition. For example:

```
// ✅
<Link href="/about" />
// ✅
<Link href="/user/1" />
// ✅
<Link href={`/user/${id}`} />
// ✅
<Link href={('/user' + id) as Href} />

// ❌ TypeScript errors if href is not a valid route
<Link href="/usser/1" />
```

For dynamic routes, Href's need to be objects and their parameters are strictly typed

```
// ✅
<Link href={{ pathname: "/user/[id]", params: { id: 1 }}} />


// ❌ TypeScript errors as href is valid, but it should be a HrefObject with params
<Link href="/user/[id]" />
// ❌ TypeScript errors as params contains invalid keys
<Link href={{ pathname: "/user/[id]", params: { _id: 1 }}} />
// ❌ TypeScript errors as params contains unknown keys
<Link href={{ pathname: "/user/[id]", params: { id: 1, id2: 2 }}} />
```

## Changes made to environment

The `includes` field of your `tsconfig.json` will be updated to include `expo-env.d.ts` and a hidden `.expo` folder. These entries are required and should not be removed.

The generated `expo-env.d.ts` should not be removed or changed at any time. It should not be committed and should be ignored by version control (e.g. inside your .gitignore file).

### Global Types

Expo Router makes the following changes to your TypeScript environment.

- Sets `process.env.NODE_ENV = "development" | "production" | "test"`
- Allows the importing of `.[css|sass|scss]` files
- Sets the exports of `*.module.[css|sass|scss]` to be `Record<string, string`
- Add types for Metro's `require.context`

### React Native Web

Using [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html), Expo Router adds additional types for React Native Web.

- Add additional web-only styles for `ViewStyle/TextStyle/ImageStyle`
- Add `tabIndex`/`accessibilityLevel`/`lang` to `TextProps`
- Add `hovered` to Pressable's `children` and `style` state callback function
