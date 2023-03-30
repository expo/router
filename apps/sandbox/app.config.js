process.env.EXPO_TUNNEL_SUBDOMAIN = "bacon-router-sandbox";

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
  extra: {
    router: {
      handoffOrigin: `https://${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`,
      origin:
        process.env.NODE_ENV !== "production"
          ? `https://${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`
          : "https://smart-symbiote.netlify.app/",
    },
  },
  ios: {
    bundleIdentifier: "app.expo.router.sandbox",
    associatedDomains: [
      `applinks:${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`,
      `webcredentials:${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`,
      `activitycontinuation:${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`,
      // "applinks:bacon-router-sandbox.ngrok.io?mode=developer",
      // "webcredentials:bacon-router-sandbox.ngrok.io?mode=developer",
      // "activitycontinuation:bacon-router-sandbox.ngrok.io?mode=developer",
    ],
    infoPlist: {
      CoreSpotlightContinuation: true,
    },
  },
};
