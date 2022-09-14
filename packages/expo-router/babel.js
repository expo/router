// A babel plugin that adds `export const __filename = '...'` to every file in the app directory.

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
    },
  };
};
