import { transformAsync } from "../index";

describe(transformAsync, () => {
  it(`should transform css in dev mode`, async () => {
    const result = await transformAsync(
      "body { color: red; }",
      {
        importLoaders: 1,
        modules: true,
      },
      {
        filename: "test.css",
        projectRoot: "/",
        sourceMap: null,
      }
    );
    expect(result).toBeDefined();

    expect(result).toMatchInlineSnapshot(`
      "// Imports
      import ___CSS_LOADER_API_IMPORT___ from \\"./Users/evanbacon/Documents/GitHub/expo-router/packages/expo-metro-runtime/src/transformer/css/web/runtime/api.ts\\";
      var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___();
      // Module
      ___CSS_LOADER_EXPORT___.push([module.id, \\"body { color: red; }\\", \\"\\"]);
      // Exports
      ___CSS_LOADER_EXPORT___.locals = {};
      export default ___CSS_LOADER_EXPORT___;
      "
    `);
    // expect(result).toMatchSnapshot();

    // expect(result).toMatch(/expo-css-hmr/);
  });
});
