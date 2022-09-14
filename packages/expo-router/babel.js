// A babel plugin that adds `export const __filename = '...'` to every file in the app directory.

const { relative, join } = require("path");

module.exports = function (api) {
  const { types: t } = api;
  const getRelPath = (state) =>
    "./" + relative(state.file.opts.root, state.filename);
  const isInAppDirectory = (state) => {
    const { filename } = state;
    const appDir = join(state.file.opts.root, "app");

    return join(filename).startsWith(appDir);
  };
  const isContextModule = (state) => {
    const { filename } = state;
    return filename.match(/\?ctx=/);
  };

  return {
    visitor: {
      Program(path, state) {
        if (isInAppDirectory(state) && !isContextModule(state)) {
          const relativePath = getRelPath(state);
          path.unshiftContainer(
            "body",
            t.exportNamedDeclaration(
              t.variableDeclaration("const", [
                t.variableDeclarator(
                  t.identifier("__filename"),
                  t.stringLiteral(relativePath)
                ),
              ])
            )
          );
        }
      },
    },
  };
};
