/** @type import('expo/config').ExpoConfig */
module.exports = {
  name: "Router Sandbox",
  slug: "expo-router-sandbox",
  scheme: "sandbox",
  splash: {
    image: "./splash.png",
    backgroundColor: "#1c2026",
  },
  web: {
    bundler: "metro",
  },
  extra: {
    router: {
      // THIS DOES NOT WORK -- DO NOT USE
      unstable_src: process.env.E2E_ROUTER_SRC,
      origin: "https://smart-symbiote.netlify.app/",
    },
  },
};
