// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { build: twBuild } = require("tailwindcss/lib/cli/build");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(__dirname);

const inputPath = path.relative(__dirname, "./global.css");
const outputPath = path.resolve(
  __dirname,
  "node_modules/.cache/expo/global.css"
);

const originalGetTransformOptions = config.transformer.getTransformOptions;

config.transformer = {
  ...config.transformer,
  asyncRequireModulePath: require.resolve("@expo/metro-runtime/async-require"),
  externallyManagedCss: {
    [inputPath]: outputPath,
  },
  async getTransformOptions(entryPoints, options, getDependenciesOf) {
    process.stdout.clearLine();
    await twBuild({
      "--input": inputPath,
      "--output": outputPath,
      "--watch": options.dev ? "always" : false,
      "--poll": true,
    });

    return originalGetTransformOptions?.(
      entryPoints,
      options,
      getDependenciesOf
    );
  },
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
