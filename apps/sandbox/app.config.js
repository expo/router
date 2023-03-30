process.env.EXPO_TUNNEL_SUBDOMAIN = "bacon-router-sandbox";

/** @type {import('expo/config').ExpoConfig} */
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
  ios: {
    bundleIdentifier: "app.expo.router.sandbox",
    associatedDomains: [
      "applinks:bacon-router-sandbox.ngrok.io",
      "webcredentials:bacon-router-sandbox.ngrok.io",
      "activitycontinuation:bacon-router-sandbox.ngrok.io",
      // "applinks:bacon-router-sandbox.ngrok.io?mode=developer",
      // "webcredentials:bacon-router-sandbox.ngrok.io?mode=developer",
      // "activitycontinuation:bacon-router-sandbox.ngrok.io?mode=developer",
    ],
    infoPlist: {
      CoreSpotlightContinuation: true,
    },
  },
};
