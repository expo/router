const nodePath = require("path");
const resolveFrom = require("resolve-from");

const debug = require("debug")("expo:router:babel");

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

  // push a new babel-plugin-transform-imports plugin
  // to the plugins array

  return {
    name: "expo-router",
    visitor: {
      // Add support for Node.js __filename
      Identifier(path, state) {
        if (path.node.name === "__filename") {
          path.replaceWith(t.stringLiteral(getRelPath(state)));
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

        // Used for log box and stuff
        if (
          t.isIdentifier(parent.node.property, {
            name: "EXPO_PROJECT_ROOT",
          }) &&
          !parent.parentPath.isAssignmentExpression()
        ) {
          parent.replaceWith(
            t.stringLiteral(
              process.env.EXPO_PROJECT_ROOT || state.file.opts.root || ""
            )
          );
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
          t.stringLiteral(getExpoRouterAppRoot(state.file.opts.root))
        );
      },
    },
  };
};
