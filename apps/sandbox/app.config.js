process.env.EXPO_TUNNEL_SUBDOMAIN = "bacon-router-sandbox";

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: "Router Sandbox",
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
