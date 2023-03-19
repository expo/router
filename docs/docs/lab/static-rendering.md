---
title: Static Rendering
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

> Web-only: Native platforms don't require HTML.

Expo Router supports rendering routes to static HTML for improved **web** performance and SEO.

```
EXPO_USE_STATIC=1 npx expo export
```

- The environment variable `EXPO_USE_STATIC` must be enabled while static rendering is in beta.
- `npx expo export --platform web` will skip bundling for native, this is sometimes faster when the native bundle is not cached already.

If you check the `dist` folder, you'll see static HTML files for each route.

## Build-time generation

Dynamic routes (e.g. `[bacon].tsx`) must be rendered with a custom Node.js server, which can redirect to the correct static HTML file. However, you can generate static HTML files locally and deploy them to a static hosting provider.

To generate static pages on build, export the function `generateStaticParams` with an array of objects. Each object represents a set of parameters to render, each object must contain all of the parameters for the route, e.g. `/[foo]/[bar]` must have both `foo` and `bar` in the object.

```js title=app/[alpha].js
import { useSearchParams } from "expo-router";

export function generateStaticParams() {
  return [{ alpha: "a" }, { alpha: "b" }, { alpha: "c" }];
}

export default function Alpha() {
  const { alpha } = useSearchParams();
  return <div>Alpha: {alpha}</div>;
}
```

The function `generateStaticParams` can be nested to support multiple dynamic routes.

Consider the following Layout Route which statically defines the `color` parameter.

```js title=app/[color]/_layout.tsx
export function generateStaticParams() {
  return [
    {
      color: "red",
    },
  ];
}

// ...
```

The child route `[shape].tsx` will now be passed `params = { color: red }` when it is rendered.

```js title=app/[color]/[shape].tsx
export function generateStaticParams({
  params,
}: {
  params: { color: string },
}) {
  return [
    {
      ...params,
      shape: "square",
    },
  ];
}

// ...
```

This will generate the following files (subject to change):

```
dist/red/square.html
dist/red/[shape].html
dist/[color]/[shape].html
```

## Head

> Subject to change!

The `Head` component can be used to set the page title and meta tags. You can use any web meta tag inside the head.

```js title=app/index.js
import Head from "expo-router/head";
import { View, Text } from "react-native";

export default function Home() {
  return (
    <View>
      <Head>
        <title>My page title</title>
        <meta name="description" content="My page description" />
      </Head>
      <Text>Home</Text>
    </View>
  );
}
```

> Native support for Head is planned, but not supported yet.

## Root HTML

> Subject to change!

By default, Expo Router adds HTML and a CSS reset that accomodates React Native for web. You can customize the root HTML by creating a `app/+dom.tsx` (TODO(EvanBacon): better name ???).

```js title=app/+dom.tsx
import { StyleReset } from "expo-router/dom";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
        />
        {/* Reset styles for react-native-web */}
        <StyleReset />
      </head>
      <body style={{ height: "100%", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
```

## Request-time generation

Also known as "server-side rendering", this is not supported yet.
