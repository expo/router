// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const path = require("path");

/**
 * @typedef WithMetroConfigOptions
 * @prop {string} [projectRoot] The directory of your app
 * @prop {string} [workspaceRoot] The top level of your project or monorepo
 */

/**
 * @param {WithMetroConfigOptions & Partial<import('metro-config').ConfigT>} [config]
 */
module.exports = function ({
  projectRoot = __dirname,
  workspaceRoot,
  ...config
} = {}) {
  config = {
    ...getDefaultConfig(projectRoot),
    ...config,
  };

  config.transformer = {
    ...config.transformer,
    asyncRequireModulePath: require.resolve(
      "@expo/metro-runtime/async-require"
    ),
  };

  config.server = {
    ...config.server,
    experimentalImportBundleSupport: true,
  };

  config.watcher = {
    // +73.3
    ...config.watcher,
    healthCheck: {
      enabled: true,
    },
  };

  const isMonorepo = workspaceRoot && workspaceRoot !== projectRoot;

  if (isMonorepo) {
    // 1.Watch all files within the monorepo
    if (workspaceRoot) {
      config.watchFolders = [...config.watchFolders, workspaceRoot];
    }

    // 2. Let Metro know where to resolve packages and in what order
    config.resolver.nodeModulesPaths = [
      ...config.resolver.nodeModulesPaths,
      path.resolve(projectRoot, "node_modules"),
      path.resolve(workspaceRoot, "node_modules"),
    ];
    // 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
    config.resolver.disableHierarchicalLookup = true;
  } else {
    config.resolver.nodeModulesPaths = [
      ...config.resolver.nodeModulesPaths,
      path.resolve(projectRoot, "node_modules"),
    ];
  }

  config.cacheStores = [
    // Ensure the cache isn't shared between projects
    // this ensures the transform-time environment variables are changed to reflect
    // the current project.
    new FileStore({
      root: path.join(projectRoot, "node_modules/.cache/metro"),
    }),
  ];

  return config;
};
