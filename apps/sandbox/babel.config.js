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
      "@expo/html-elements/babel",
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
