process.env.EXPO_TUNNEL_SUBDOMAIN = "bacon-router-sandbox";

const origin =
  process.env.NODE_ENV === "development"
    ? `https://${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`
    : "https://smart-symbiote.netlify.app";

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: "Everywhere",
  slug: "expo-router-sandbox",
  icon: "./icon.png",
  scheme: "sandbox",
  splash: {
    image: "./icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  web: {
    bundler: "metro",
  },
  plugins: [
    [
      "expo-router",
      {
        asyncRoutes: "development",
        headOrigin: origin,
        origin,
      },
    ],
  ],
  android: {
    package: "app.expo.router.sandbox",
  },
  ios: {
    bundleIdentifier: "app.expo.router.sandbox",
    associatedDomains: [
      `applinks:${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`,
      `webcredentials:${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`,
      `activitycontinuation:${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`,
    ],
    infoPlist: {
      CoreSpotlightContinuation: true,
    },
  },
  plugins: ["expo-head"],
};
