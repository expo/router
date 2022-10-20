module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          importSource: "@welldone-software/why-did-you-render",
        },
      ],
    ],
    plugins: [
      require.resolve("expo-router/babel"),
      "react-native-reanimated/plugin",
    ],
  };
};
