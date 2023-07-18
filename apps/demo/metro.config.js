// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

config.watcher = {
  // +73.3
  ...config.watcher,
  healthCheck: {
    enabled: true,
  },
};

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

const { FileStore } = require("metro-cache");
config.cacheStores = [
  // Ensure the cache isn't shared between projects
  // this ensures the transform-time environment variables are changed to reflect
  // the current project.
  new FileStore({ root: path.join(projectRoot, "node_modules/.cache/metro") }),
];

module.exports = config;
