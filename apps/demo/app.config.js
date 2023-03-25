process.env.EXPO_USE_PATH_ALIASES = true;
process.env.EXPO_USE_STATIC = true;

module.exports = {
  name: "Router Demo",
  slug: "expo-router",
  scheme: "bacontext",
  splash: {
    image: "./splash.png",
    backgroundColor: "#1c2026",
  },
  web: {
    bundler: "metro",
  },
};
