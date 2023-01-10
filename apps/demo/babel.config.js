module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo"]],
    plugins: [
      require.resolve("expo-router/babel"),
      require.resolve("@expo/html-elements/babel"),
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      [
        require.resolve("nativewind/babel"),
        {
          allowModuleTransform: [
            "@expo/html-elements",
            "@bacons/react-views",
            "expo-router",
          ],
        },
      ],
    ],
  };
};
