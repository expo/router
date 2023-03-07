// Learn more https://docs.expo.io/guides/customizing-metro
const withExpoRouter = require("expo-router/metro-config");
const path = require("path");

module.exports = withExpoRouter({
  workspaceRoot: path.resolve(__dirname, "../.."),
});
