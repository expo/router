/// <reference path="metro-require.d.ts" />

/** Optionally import `app/+root.js` file. */
export const ctx = require.context(
  process.env.EXPO_ROUTER_APP_ROOT!,
  false,
  /\+root\.[tj]sx?$/,
  "sync"
);
