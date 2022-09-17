const { relative } = require("path");

module.exports = function (api) {
  const { types: t } = api;
  const getRelPath = (state) =>
    "./" + relative(state.file.opts.root, state.filename);

  return {
    name: "expo-router",
    visitor: {
      // Add support for Node.js __filename
      Identifier(path, state) {
        if (path.node.name === "__filename") {
          path.replaceWith(t.stringLiteral(getRelPath(state)));
        }
      },

      // Auto add the React prop `context={require.context('./app')}` to a component named `Root` that's
      JSXOpeningElement(path, state) {
        if (!getRelPath(state).match(/^\.\/app\//)) {
          return;
        }
        if (path.node.name.name === "ExpoRoot") {
          // Check if the context prop already exists
          const contextProp = path.node.attributes.find(
            (attr) => attr.name.name === "context"
          );
          if (contextProp) {
            return;
          }

          path.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("context"),
              t.jsxExpressionContainer(
                t.callExpression(t.identifier("require"), [
                  t.callExpression(t.identifier("context"), [
                    t.stringLiteral("./app"),
                  ]),
                ])
              )
            )
          );
        }
      },

      // Convert `process.env.EXPO_APP_ROOT` to a string literal
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

        if (!t.isIdentifier(parent.node.property, { name: "EXPO_APP_ROOT" })) {
          return;
        }

        if (parent.parentPath.isAssignmentExpression()) {
          return;
        }

        parent.replaceWith(t.stringLiteral(process.env.EXPO_APP_ROOT));
      },
    },
  };
};
