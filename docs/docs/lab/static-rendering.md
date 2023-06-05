---
title: Static Rendering
---

> This guide requires `expo@49.0.0-alpha.3` or greater––everything listed here is still experimental. You may need to [use Expo CLI on `main`](https://github.com/expo/expo/tree/main/packages/%40expo/cli#contributing) to use these features.

In order to enable SEO on web, you must statically render your app. This guide will walk you through the process of statically rendering your Expo Router app.

## Setup

First, you must enable static rendering in your `app.json` file.

```json title=app.json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static"
    }
  }
}
```

You will need to ensure you either have no `metro.config.js` file or that your metro config file is compatible with static rendering.

```js title=metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Additional features...
});

module.exports = config;
```

Now simply run `npx expo` to start using your statically rendered website in development.

## Production

Bundle your static website for production by running the following command:

```sh
npx expo export --platform web
```

This will create a `dist` folder with your statically rendered website. You can test this folder locally by running `npx serve dist`.

You can then deploy this folder to any static hosting service. Note that this is not a single-page application, nor does it contain a custom server API. This means dynamic routes will not arbitrarily work. You will need to use a serverless function to handle dynamic routes.

## Dynamic Routes

The `static` output will generate single HTML files for each route. This means that dynamic routes will not work out of the box. You can generate known routes ahead of time using the `generateStaticParams` function.

```js title=app/blog/[id].tsx
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export async function generateStaticParams() {
  const posts = await getPosts();
  // Return an array of params to generate static HTML files for.
  // Each entry in the array will be a new page.
  return posts.map((post) => ({ id: post.id }));
}

export default function Page() {
  const { id } = useLocalSearchParams();

  return <Text>Post {id}</Text>;
}
```

This will output a file for each post in the `dist` folder. For example, if the `generateStaticParams` method returned `[{ id: "alpha" }, { id: "beta" }]`, the following files would be generated:

```title=File System
dist/
  blog/
    alpha.html
    beta.html
```

## Root HTML

You can customize the root HTML file by creating a `app/+html.tsx` file in your project. This file exports a React component that only ever runs in Node.js. The component will wrap all pages in the app. This is useful for adding global `<head>` elements or disabling body scrolling.

> Notice: Global context providers should go in the [Root Layout](/docs/guides/root-layout) component, not the Root HTML component.

```js title=app/+html.tsx
import { ScrollViewStyleReset } from "expo-router/html";

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* 
          This viewport disables scaling which makes the mobile website act more like a native app.
          However this does reduce built-in accessibility. If you want to enable scaling, use this instead:
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        */}
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
        />
        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- The `children` prop comes with the root `<div id="root" />` tag included inside.
- The JavaScript scripts are appended after the static render.
- React Native web styles are statically injected automatically.

### `expo-router/html`

The exports from `expo-router/html` are related to the Root HTML component.

- `ScrollViewStyleReset`: Root style-reset for full-screen React Native web apps with a root `<ScrollView />` should use the following styles to ensure native parity. [Learn more](https://necolas.github.io/react-native-web/docs/setup/#root-element).

## Meta Tags

You can add meta tags to your pages with the [`<Head />`](/docs/features/head) module from `expo-router`:

```js title=app/about.tsx
import Head from "expo-router/head";
import { Text } from "react-native";

export default function Page() {
  return (
    <>
      <Head>
        <title>My Blog Website</title>
        <meta name="description" content="This is my blog." />
      </Head>
      <Text>About my blog</Text>
    </>
  );
}
```

The head elements can be updated dynamically using the same API, but it's useful for SEO to have static head elements rendered ahead of time.

## Static Files

Expo CLI supports a root `/public` directory that will be copied to the `dist` folder during static rendering. This is useful for adding static files like images, fonts, and other assets.

```title=File System
public/
  favicon.ico
  logo.png
  .well-known/
    apple-app-site-association
```

These files will be copied to the `dist` folder during static rendering:

```title=File System
dist/
  index.html
  favicon.ico
  logo.png
  .well-known/
    apple-app-site-association
  _expo/
    static/
      js/
        index-1234567890.js
      css/
        index-1234567890.css
```

Static assets can be accessed in runtime code using relative paths (**WEB ONLY**). For example, the `logo.png` file can be accessed at `/logo.png`:

```js title=app/index.tsx
import { Image } from "react-native";

export default function Page() {
  return <Image source={{ uri: "/logo.png" }} />;
}
```

## FAQ

### How do I add a custom server?

As of Expo Router v2 there is no prescriptive way to add a custom server. You can use any server you want, but you will need to handle dynamic routes yourself. You can use the `generateStaticParams` function to generate static HTML files for known routes.

In the future there will be a server API and a new `web.output` mode which will generate a project that will--amongst other things--supports dynamic routes.

## Server-side Rendering

Rendering at request-time (SSR) is not supported in `web.output: 'static'`. This will likely be added in a future version of Expo Router.

### Where can I deploy my statically rendered website?

You can deploy your statically rendered website to any static hosting service. Here are some popular options:

- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)
- [Render](https://render.com/)
- [Surge](https://surge.sh/)

> Note: You don't need to add Single-Page Application-styled redirects to your static hosting service. The static website is not a single-page application. It is a collection of static HTML files.
