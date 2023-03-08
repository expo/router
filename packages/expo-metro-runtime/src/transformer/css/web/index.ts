/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

import path from "path";
import postcss from "postcss";

import CssSyntaxError from "./CssSyntaxError";
import {
  normalizeSourceMap,
  getExportCode,
  getImportCode,
  getModuleCode,
} from "./getModuleCode";
import { icssParser, importParser, urlParser } from "./plugins";
import {
  normalizeOptions,
  shouldUseImportPlugin,
  shouldUseURLPlugin,
  shouldUseIcssPlugin,
  getPreRequester,
  getFilter,
  getModulesPlugins,
  sort,
  combineRequests,
} from "./utils";

export async function transformAsync(
  content: string,
  options: {
    url?: boolean;
    import?: boolean;
    sourceMap?: boolean;
    importLoaders?: boolean | string | number;
  },
  meta: { filename: string; projectRoot: string; sourceMap: any }
): Promise<string> {
  return loader.call(
    {
      getOptions() {
        return options;
      },
      getResolve() {
        return function () {
          console.error("TODO");
        };
      },
      resourcePath: meta.filename,
      rootContext: meta.projectRoot,
      context: meta.projectRoot,
      _compilation: {
        getPath: (
          // Like `[contenthash]`
          name: string,
          data: {
            // relative path
            filename: string;
            contentHash: string;
            chunk: {
              name: string;
              hash: string;
              contentHash: string;
            };
          }
        ) => {
          console.log("TODO: getPath", name, data);
          if (name === "[contenthash]") {
            return data.filename.replace(/[^a-zA-Z0-9_]/g, "_");
          }
          return "TODO-COMPILATION-GET-PATH";
        },
        outputOptions: {
          path: meta.projectRoot,
        },
      },
    },
    content,
    meta.sourceMap
  );
}

export default async function loader(this: any, content, map) {
  const rawOptions = this
    .getOptions
    // schema
    ();

  const options = normalizeOptions(rawOptions, this);

  const replacements = [];
  const exports = [];
  const plugins: any[] = [...getModulesPlugins(options, this)];

  const importPluginImports = [];
  const importPluginApi = [];

  if (shouldUseImportPlugin(options)) {
    plugins.push(
      importParser({
        isSupportAbsoluteURL: false,
        isSupportDataURL: false,
        isCSSStyleSheet: options.exportType === "css-style-sheet",
        loaderContext: this,
        imports: importPluginImports,
        api: importPluginApi,
        // filter: options.import.filter,
        urlHandler: (url) =>
          JSON.stringify(
            path.relative(
              this.rootContext,
              combineRequests(getPreRequester(this)(options.importLoaders), url)
            )
          ),
      })
    );
  }

  const urlPluginImports: any[] = [];

  if (shouldUseURLPlugin(options)) {
    plugins.push(
      urlParser({
        isSupportAbsoluteURL: false,
        isSupportDataURL: true,
        imports: urlPluginImports,
        replacements,
        context: this.context,
        rootContext: this.rootContext,
        filter: getFilter(options.url.filter, this.resourcePath),
        resolver: undefined,
        urlHandler: (url) =>
          JSON.stringify(path.relative(this.rootContext, url)),
        // Support data urls as input in new URL added in webpack@5.38.0
      })
    );
  }

  const icssPluginImports = [];
  const icssPluginApi = [];

  const needToUseIcssPlugin = shouldUseIcssPlugin(options);

  if (needToUseIcssPlugin) {
    plugins.push(
      icssParser({
        loaderContext: this,
        imports: icssPluginImports,
        api: icssPluginApi,
        replacements,
        exports,
        urlHandler: (url) =>
          JSON.stringify(
            path.relative(
              this.rootContext,
              combineRequests(getPreRequester(this)(options.importLoaders), url)
            )
          ),
      })
    );
  }

  const { resourcePath } = this;

  let result;

  try {
    result = await postcss(plugins).process(content, {
      // @ts-expect-error: idk
      hideNothingWarning: true,
      from: resourcePath,
      to: resourcePath,
      map: options.sourceMap
        ? {
            prev: map ? normalizeSourceMap(map, resourcePath) : null,
            inline: false,
            annotation: false,
          }
        : false,
    });
  } catch (error) {
    if (error.file) {
      // this.addDependency(error.file);
      console.error("addDependency", error.file);
    }

    if (error.name === "CssSyntaxError") {
      throw new CssSyntaxError(error);
    }
    throw error;
  }

  for (const warning of result.warnings()) {
    // this.emitWarning(new Warning(warning));
    console.warn("emitWarning", warning);
  }

  const imports: {
    type?: string;
    importName: string;
    url: string;
  }[] = [
    ...icssPluginImports.sort(sort),
    ...importPluginImports.sort(sort),
    ...urlPluginImports.sort(sort),
  ];

  const api = [...importPluginApi.sort(sort), ...icssPluginApi.sort(sort)];

  if (options.modules.exportOnlyLocals !== true) {
    imports.unshift({
      type: "api_import",
      importName: "___CSS_LOADER_API_IMPORT___",
      url: JSON.stringify(
        path.relative(this.rootContext, require.resolve("./runtime/api"))
      ),
    });

    // NOTE: I dropped the source maps
  }

  const importCode = getImportCode(imports, options);
  const moduleCode = getModuleCode(result, api, replacements, options, this);
  const exportCode = getExportCode(
    exports,
    replacements,
    needToUseIcssPlugin,
    options
  );

  return `${importCode}${moduleCode}${exportCode}`;
}
