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
    },
  };
};
