---
title: Hosting
---

The current behavior of web is to export as a single-page application or (SPA). This means you need to redirect incoming URL requests on the server to the root `index.html` file.

## Netlify

Create a `./public/_redirects` (`./web/_redirects` with Expo Webpack) file and add the following:

```
/*    /index.html   200
```

## Vercel

Create a `./vercel.json` and add the following:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

## Serve CLI

If you're testing the project locally with `npx serve` then use the `--single` flag to enable single-page application mode.

```bash
npx serve dist --single
```
