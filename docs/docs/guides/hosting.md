---
title: Hosting
---

The current behavior of web is to export as a single-page application or (SPA). This means you need to redirect incoming URL requests on the server to the root `index.html` file.

Use `npx expo export --platform web` to export the static bundle into the `./dist` folder.

## Netlify

Create a `./public/_redirects` (`./web/_redirects` with Expo Webpack) file and add the following:

```
/*    /index.html   200
```

## Vercel

1. Import your repository.
2. Your build and development settings should look like this: 
- Framework preset: Other
- Build command: `npx expo export --platform web`
- Output directory: `dist`

![image](https://github.com/expo/expo-cli/assets/55203625/d8646ff2-4c7c-4e5e-8ed7-5e91c7cab288)

3. Create a `./public/vercel.json` (contents of the root `public` folder are copied into the output `dist` folder) and add the following:

```json
{
  "rewrites": [
    { "source": "/:path*", "destination": "/index.html"}
  ]
}
```

4. Push your changes and to trigger a deployment.

## Serve CLI

If you're testing the project locally with `npx serve` then use the `--single` flag to enable single-page application mode.

```bash
npx serve dist --single
```
