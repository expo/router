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
      [
        "babel-plugin-transform-imports",
        {
          "expo-router": {
            skipDefaultConversion: true,
            // Redirect Drawer import to build/layouts/Drawer
            transform: (importName) => {
              if (["Stack", "Tabs"].includes(importName)) {
                return `expo-router/build/layouts/${importName}`;
              }
              return "expo-router/build/exports";
            },
          },
        },
      ],
    ],
  };
};
