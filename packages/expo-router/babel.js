const nodePath = require("path");
const resolveFrom = require("resolve-from");
const { getExpoConstantsManifest } = require("./node/getExpoConstantsManifest");

const debug = require("debug")("expo:router:babel");

function getExpoAppManifest(projectRoot) {
  if (process.env.APP_MANIFEST) {
    return process.env.APP_MANIFEST;
  }

  const exp = getExpoConstantsManifest(projectRoot);

  debug("public manifest", exp);

  return JSON.stringify(exp);
}

function getExpoRouterAppRoot(projectRoot) {
  if (process.env.EXPO_ROUTER_APP_ROOT) {
    return process.env.EXPO_ROUTER_APP_ROOT;
  }
  const routerEntry = resolveFrom.silent(projectRoot, "expo-router/entry");

  if (!routerEntry) {
    console.warn(
      `Required environment variable EXPO_ROUTER_APP_ROOT is not defined, bundle with Expo CLI (expo@^46.0.13) to fix.`
    );
    process.env.EXPO_ROUTER_APP_ROOT = "../../app";
    return process.env.EXPO_ROUTER_APP_ROOT;
  }
  // It doesn't matter if the app folder exists.
  const appFolder = nodePath.join(projectRoot, "app");
  const appRoot = nodePath.relative(nodePath.dirname(routerEntry), appFolder);
  debug("routerEntry", routerEntry, appFolder, appRoot);

  return appRoot;
}

module.exports = function (api) {
  const { types: t } = api;
  const getRelPath = (state) =>
    "./" + nodePath.relative(state.file.opts.root, state.filename);

  return {
    name: "expo-router",
    visitor: {
      // Add support for Node.js __filename
      Identifier(path, state) {
        if (path.node.name === "__filename") {
          path.replaceWith(
            t.stringLiteral(
              // `/index.js` is the value used by Webpack.
              getRelPath(state)
            )
          );
        }
        // Add support for Node.js `__dirname`.
        // This static value comes from Webpack somewhere.
        if (path.node.name === "__dirname") {
          path.replaceWith(t.stringLiteral("/"));
        }
      },

      // Convert `process.env.EXPO_ROUTER_APP_ROOT` to a string literal
      MemberExpression(path, state) {
        if (
          !t.isIdentifier(path.node.object, { name: "process" }) ||
          !t.isIdentifier(path.node.property, { name: "env" })
        ) {
          return;
        }

        const parent = path.parentPath;
        if (!t.isMemberExpression(parent.node)) {
          return;
        }

        const projectRoot =
          process.env.EXPO_PROJECT_ROOT || state.file.opts.root || "";

        // Used for log box and stuff
        if (
          t.isIdentifier(parent.node.property, {
            name: "EXPO_PROJECT_ROOT",
          }) &&
          !parent.parentPath.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(projectRoot));
          return;
        }

        // Enable static rendering
        // TODO: Use a serializer or something to ensure this changes without
        // needing to clear the cache.
        if (
          t.isIdentifier(parent.node.property, {
            name: "EXPO_PUBLIC_USE_STATIC",
          }) &&
          !parent.parentPath.isAssignmentExpression() &&
          process.env.EXPO_PUBLIC_USE_STATIC
        ) {
          parent.replaceWith(
            t.stringLiteral(process.env.EXPO_PUBLIC_USE_STATIC)
          );
          return;
        }

        // Surfaces the `app.json` (config) as an environment variable which is then parsed by
        // `expo-constants` https://docs.expo.dev/versions/latest/sdk/constants/
        if (
          t.isIdentifier(parent.node.property, {
            name: "APP_MANIFEST",
          }) &&
          !parent.parentPath.isAssignmentExpression()
        ) {
          const manifest = getExpoAppManifest(projectRoot);
          parent.replaceWith(t.stringLiteral(manifest));
          return;
        }

        if (
          !t.isIdentifier(parent.node.property, {
            name: "EXPO_ROUTER_APP_ROOT",
          })
        ) {
          return;
        }

        if (parent.parentPath.isAssignmentExpression()) {
          return;
        }

        parent.replaceWith(
          // This is defined in Expo CLI when using Metro. It points to the relative path for the project app directory.
          t.stringLiteral(getExpoRouterAppRoot(projectRoot))
        );
      },
    },
  };
};
