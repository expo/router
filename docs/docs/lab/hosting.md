---
title: Hosting (Experimental)
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

In order to support dynamic features like Dynamic Routes and Server functionality, you'll need to deploy a Node.js server which can handle incoming requests. This involves more setup than a static site, but it's worth it for the added functionality.

## Netlify

1. Create `netlify/functions/server.js` in your project and add the following:

```js
const { createRequestHandler } = require("@expo/server/vendor/netlify");

// netlify dev
const handler = createRequestHandler({
  // The path to the directory containing your app's compiled assets.
  build: require("path").join(__dirname, "../../dist"),
  mode: process.env.NODE_ENV,
});

module.exports = { handler };
```

2. Create a `netlify.toml` file and add the following:

```toml
[build]
  command = "expo export --platform web"
  functions = "netlify/functions"
  publish = "dist"

[dev]
  functions = "netlify-functions"
  functionsPort = 3000
  port = 3000

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/server"
  status = 404

[functions]
  included_files = ["dist/_expo/**/*"]

[[headers]]
  for = "/dist/_expo/functions/*"
  [headers.values]
    "Cache-Control" = "public, max-age=31536000, s-maxage=31536000"
```

3. Publish your project to Netlify with `npx netlify deploy`.
4. Now that you have a web URL, you can setup symbiotic features like: [Route Handlers](/docs/lab/server), and [Universal Links](/docs/guides/universal-links).
