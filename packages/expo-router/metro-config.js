// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

module.exports.getDefaultConfig = (dirname) => {
  const config = getDefaultConfig(dirname);

  config.transformer = {
    ...config.transformer,
    // `require.context` support
    unstable_allowRequireContext: true,
  };

  return config;
};
