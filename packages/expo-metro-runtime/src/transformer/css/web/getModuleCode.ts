import path from "path";

// We can't use path.win32.isAbsolute because it also matches paths starting with a forward slash
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;

function normalizePath(file) {
  return path.sep === "\\" ? file.replace(/\\/g, "/") : file;
}

function getValidLocalName(localName, exportLocalsConvention) {
  const result = exportLocalsConvention(localName);

  return Array.isArray(result) ? result[0] : result;
}

const ABSOLUTE_SCHEME = /^[a-z0-9+\-.]+:/i;

function getURLType(source) {
  if (source[0] === "/") {
    if (source[1] === "/") {
      return "scheme-relative";
    }

    return "path-absolute";
  }

  if (IS_NATIVE_WIN32_PATH.test(source)) {
    return "path-absolute";
  }

  return ABSOLUTE_SCHEME.test(source) ? "absolute" : "path-relative";
}

export function normalizeSourceMap(map, resourcePath) {
  let newMap = map;

  // Some loader emit source map as string
  // Strip any JSON XSSI avoidance prefix from the string (as documented in the source maps specification), and then parse the string as JSON.
  if (typeof newMap === "string") {
    newMap = JSON.parse(newMap);
  }

  delete newMap.file;

  const { sourceRoot } = newMap;

  delete newMap.sourceRoot;

  if (newMap.sources) {
    // Source maps should use forward slash because it is URLs (https://github.com/mozilla/source-map/issues/91)
    // We should normalize path because previous loaders like `sass-loader` using backslash when generate source map
    newMap.sources = newMap.sources.map((source) => {
      // Non-standard syntax from `postcss`
      if (source.indexOf("<") === 0) {
        return source;
      }

      const sourceType = getURLType(source);

      // Do no touch `scheme-relative` and `absolute` URLs
      if (sourceType === "path-relative" || sourceType === "path-absolute") {
        const absoluteSource =
          sourceType === "path-relative" && sourceRoot
            ? path.resolve(sourceRoot, normalizePath(source))
            : normalizePath(source);

        return path.relative(path.dirname(resourcePath), absoluteSource);
      }

      return source;
    });
  }

  return newMap;
}

export function normalizeSourceMapForRuntime(map, loaderContext) {
  const resultMap = map ? map.toJSON() : null;

  if (resultMap) {
    delete resultMap.file;

    /* eslint-disable no-underscore-dangle */
    if (loaderContext?._compilation?.options?.devtool?.includes("nosources")) {
      /* eslint-enable no-underscore-dangle */

      delete resultMap.sourcesContent;
    }

    resultMap.sourceRoot = "";
    resultMap.sources = resultMap.sources.map((source) => {
      // Non-standard syntax from `postcss`
      if (source.indexOf("<") === 0) {
        return source;
      }

      const sourceType = getURLType(source);

      if (sourceType !== "path-relative") {
        return source;
      }

      const resourceDirname = path.dirname(loaderContext.resourcePath);
      const absoluteSource = path.resolve(resourceDirname, source);
      const contextifyPath = normalizePath(
        path.relative(loaderContext.rootContext, absoluteSource)
      );

      return `webpack://./${contextifyPath}`;
    });
  }

  return JSON.stringify(resultMap);
}

function printParams(media, dedupe, supports, layer) {
  let result = "";

  if (typeof layer !== "undefined") {
    result = `, ${JSON.stringify(layer)}`;
  }

  if (typeof supports !== "undefined") {
    result = `, ${JSON.stringify(supports)}${result}`;
  } else if (result.length > 0) {
    result = `, undefined${result}`;
  }

  if (dedupe) {
    result = `, true${result}`;
  } else if (result.length > 0) {
    result = `, false${result}`;
  }

  if (media) {
    result = `${JSON.stringify(media)}${result}`;
  } else if (result.length > 0) {
    result = `""${result}`;
  }

  return result;
}

export function getModuleCode(
  result: any,
  api: any,
  replacements: any,
  options: any,
  loaderContext: any
) {
  if (options.modules.exportOnlyLocals === true) {
    return "";
  }

  let sourceMapValue = "";

  if (options.sourceMap) {
    const sourceMap = result.map;

    sourceMapValue = `,${normalizeSourceMapForRuntime(
      sourceMap,
      loaderContext
    )}`;
  }

  let code = JSON.stringify(result.css);

  // let beforeCode = `var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(${
  //   options.sourceMap
  //     ? "___CSS_LOADER_API_SOURCEMAP_IMPORT___"
  //     : "___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___"
  // });\n`;
  let beforeCode = `var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(${sourceMapValue});\n`;

  for (const item of api) {
    const { url, layer, supports, media, dedupe } = item;

    if (url) {
      // eslint-disable-next-line no-undefined
      const printedParam = printParams(media, undefined, supports, layer);

      beforeCode += `___CSS_LOADER_EXPORT___.push([module.id, ${JSON.stringify(
        `@import url(${url});`
      )}${printedParam.length > 0 ? `, ${printedParam}` : ""}]);\n`;
    } else {
      const printedParam = printParams(media, dedupe, supports, layer);

      beforeCode += `___CSS_LOADER_EXPORT___.i(${item.importName}${
        printedParam.length > 0 ? `, ${printedParam}` : ""
      });\n`;
    }
  }

  for (const item of replacements) {
    const { replacementName, importName, localName } = item;

    if (localName) {
      code = code.replace(new RegExp(replacementName, "g"), () =>
        options.modules.namedExport
          ? `" + ${importName}_NAMED___[${JSON.stringify(
              getValidLocalName(
                localName,
                options.modules.exportLocalsConvention
              )
            )}] + "`
          : `" + ${importName}.locals[${JSON.stringify(localName)}] + "`
      );
    } else {
      const getUrlOptions: string[] = [];
      if (item.hash) {
        getUrlOptions.push(`hash: ${JSON.stringify(item.hash)}`);
      }
      if (item.needQuotes) {
        getUrlOptions.push("needQuotes: true");
      }

      const preparedOptions =
        getUrlOptions.length > 0 ? `, { ${getUrlOptions.join(", ")} }` : "";

      beforeCode += `var ${replacementName} = ___CSS_LOADER_GET_URL_IMPORT___(${importName}${preparedOptions});\n`;
      code = code.replace(
        new RegExp(replacementName, "g"),
        () => `" + ${replacementName} + "`
      );
    }
  }

  // Indexes description:
  // 0 - module id
  // 1 - CSS code
  // 2 - media
  // 3 - source map
  // 4 - supports
  // 5 - layer
  return `${beforeCode}// Module\n___CSS_LOADER_EXPORT___.push([module.id, ${code}, ""${sourceMapValue}]);\n`;
}

export function getExportCode(exports, replacements, icssPluginUsed, options) {
  let code = "// Exports\n";

  if (icssPluginUsed) {
    let localsCode = "";

    const addExportToLocalsCode = (names, value) => {
      const normalizedNames = Array.isArray(names)
        ? new Set(names)
        : new Set([names]);

      for (const name of normalizedNames) {
        if (options.modules.namedExport) {
          localsCode += `export var ${name} = ${JSON.stringify(value)};\n`;
        } else {
          if (localsCode) {
            localsCode += `,\n`;
          }

          localsCode += `\t${JSON.stringify(name)}: ${JSON.stringify(value)}`;
        }
      }
    };

    for (const { name, value } of exports) {
      addExportToLocalsCode(
        options.modules.exportLocalsConvention(name),
        value
      );
    }

    for (const item of replacements) {
      const { replacementName, localName } = item;

      if (localName) {
        const { importName } = item;

        localsCode = localsCode.replace(
          new RegExp(replacementName, "g"),
          () => {
            if (options.modules.namedExport) {
              return `" + ${importName}_NAMED___[${JSON.stringify(
                getValidLocalName(
                  localName,
                  options.modules.exportLocalsConvention
                )
              )}] + "`;
            } else if (options.modules.exportOnlyLocals) {
              return `" + ${importName}[${JSON.stringify(localName)}] + "`;
            }

            return `" + ${importName}.locals[${JSON.stringify(localName)}] + "`;
          }
        );
      } else {
        localsCode = localsCode.replace(
          new RegExp(replacementName, "g"),
          () => `" + ${replacementName} + "`
        );
      }
    }

    if (options.modules.exportOnlyLocals) {
      code += options.modules.namedExport
        ? localsCode
        : `export default {\n${localsCode}\n};\n`;

      return code;
    }

    code += options.modules.namedExport
      ? localsCode
      : `___CSS_LOADER_EXPORT___.locals = {${
          localsCode ? `\n${localsCode}\n` : ""
        }};\n`;
  }

  const isCSSStyleSheetExport = options.exportType === "css-style-sheet";

  if (isCSSStyleSheetExport) {
    code += "var ___CSS_LOADER_STYLE_SHEET___ = new CSSStyleSheet();\n";
    code +=
      "___CSS_LOADER_STYLE_SHEET___.replaceSync(___CSS_LOADER_EXPORT___.toString());\n";
  }

  let finalExport;

  switch (options.exportType) {
    case "string":
      finalExport = "___CSS_LOADER_EXPORT___.toString()";
      break;
    case "css-style-sheet":
      finalExport = "___CSS_LOADER_STYLE_SHEET___";
      break;
    default:
    case "array":
      finalExport = "___CSS_LOADER_EXPORT___";
      break;
  }

  code += `export default ${finalExport};\n`;

  return code;
}

export function getImportCode(imports, options) {
  let code = "";

  for (const item of imports) {
    const { importName, url, icss, type } = item;

    if (icss && options.modules.namedExport) {
      code += `import ${
        options.modules.exportOnlyLocals ? "" : `${importName}, `
      }* as ${importName}_NAMED___ from ${url};\n`;
    } else {
      code +=
        type === "url"
          ? `var ${importName} = new URL(${url}, import.meta.url);\n`
          : `import ${importName} from ${url};\n`;
    }
  }

  return code ? `// Imports\n${code}` : "";
}
