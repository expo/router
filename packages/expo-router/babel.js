// A babel plugin that adds `__filename` as the last argument of `useNavigationChildren` calls.
// Input: `useNavigationChildren(Nav)`
// Output: `useNavigationChildren(Nav, __filename)`
const { relative } = require("path");

module.exports = function (api) {
  const { types: t } = api;
  const getRelPath = (state) =>
    "./" + relative(state.file.opts.root, state.filename);

  return {
    visitor: {
      // Add support for Node.js __filename
      Identifier(path, state) {
        if (path.node.name === "__filename") {
          path.replaceWith(t.stringLiteral(getRelPath(state)));
        }
      },

      CallExpression(path, state) {
        if (["useNavigator"].includes(path.node.callee.name)) {
          if (path.node.arguments.length === 1) {
            path.node.arguments.push(t.stringLiteral(getRelPath(state)));
          }
        } else if (
          [
            "useNamedNavigationChildren",
            "useNavigationChildren",
            "useChildren",
            "useChild",
          ].includes(path.node.callee.name)
        ) {
          if (path.node.arguments.length === 0) {
            path.node.arguments.push(t.stringLiteral(getRelPath(state)));
          }
        }
      },
    },
  };
};
