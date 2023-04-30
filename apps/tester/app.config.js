/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: "Router Sandbox",
  slug: "expo-router-sandbox",
  scheme: "sandbox",
  // For testing the output bundle
  jsEngine: process.env.E2E_ROUTER_SRC ? "jsc" : "hermes",
  splash: {
    image: "./splash.png",
    backgroundColor: "#1c2026",
  },
  web: {
    bundler: "metro",
  },
  plugins: [
    [
      "expo-router",
      {
        asyncRoutes: process.env.E2E_ROUTER_ASYNC,
        // THIS DOES NOT WORK -- DO NOT USE
        unstable_src: process.env.E2E_ROUTER_SRC,
        origin: "https://smart-symbiote.netlify.app/",
      },
    ],
  ],
};
