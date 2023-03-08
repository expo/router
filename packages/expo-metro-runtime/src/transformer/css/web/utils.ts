/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

import path from "path";
import postcss from "postcss";

import modulesValues from "postcss-modules-values";
import localByDefault from "postcss-modules-local-by-default";
import extractImports from "postcss-modules-extract-imports";
import modulesScope from "postcss-modules-scope";
import { unescape, escape } from "./unescape";

export type PostCssOptions = {
  isSupportDataURL?: boolean;
  isSupportAbsoluteURL?: boolean;
  filter?: (
    url: string,
    decl?: postcss.Declaration
  ) => boolean | Promise<boolean>;

  resolver?: (
    url: string,
    context: string,
    decl?: postcss.Declaration
  ) => string | Promise<string>;
  rootContext?: string;
  context?: string;
  imports?: {
    type: string;
    importName: string;
    url: string;
    index: number;
  }[];
  replacements?: {
    replacementName: string;
    importName: string;
    hash: string;
    needQuotes: boolean;
  }[];
  urlHandler?: (
    url: string,
    decl?: postcss.Declaration
  ) => string | Promise<string>;
};

export const METRO_IGNORE_COMMENT_REGEXP = /metroIgnore:(\s+)?(true|false)/;

const NATIVE_WIN32_PATH = /^[A-Z]:[/\\]|^\\\\/i;

const preserveCamelCase = (string) => {
  let result = string;
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;

  for (let i = 0; i < result.length; i++) {
    const character = result[i];

    if (isLastCharLower && /[\p{Lu}]/u.test(character)) {
      result = `${result.slice(0, i)}-${result.slice(i)}`;
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i += 1;
    } else if (
      isLastCharUpper &&
      isLastLastCharUpper &&
      /[\p{Ll}]/u.test(character)
    ) {
      result = `${result.slice(0, i - 1)}-${result.slice(i - 1)}`;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower =
        character.toLowerCase() === character &&
        character.toUpperCase() !== character;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper =
        character.toUpperCase() === character &&
        character.toLowerCase() !== character;
    }
  }

  return result;
};

function camelCase(input) {
  let result = input.trim();

  if (result.length === 0) {
    return "";
  }

  if (result.length === 1) {
    return result.toLowerCase();
  }

  const hasUpperCase = result !== result.toLowerCase();

  if (hasUpperCase) {
    result = preserveCamelCase(result);
  }

  return result
    .replace(/^[_.\- ]+/, "")
    .toLowerCase()
    .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) => p1.toUpperCase())
    .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, (m) => m.toUpperCase());
}

function normalizePath(file) {
  return path.sep === "\\" ? file.replace(/\\/g, "/") : file;
}

// eslint-disable-next-line no-control-regex
const filenameReservedRegex = /[<>:"/\\|?*]/g;
// eslint-disable-next-line no-control-regex
const reControlChars = /[\u0000-\u001f\u0080-\u009f]/g;

function escapeLocalIdent(localident) {
  // TODO simplify in the next major release
  return escape(
    localident
      // For `[hash]` placeholder
      .replace(/^((-?[0-9])|--)/, "_$1")
      .replace(filenameReservedRegex, "-")
      .replace(reControlChars, "-")
      .replace(/\./g, "-")
  );
}

function defaultGetLocalIdent({ resourcePath }, localName, { context }) {
  const relativeResourcePath = normalizePath(
    path.relative(context, resourcePath)
  );

  return (relativeResourcePath + "_" + localName).replace(
    /[^a-zA-Z0-9_]/g,
    "_"
  );
}

function isDataUrl(url) {
  if (/^data:/i.test(url)) {
    return true;
  }

  return false;
}

export function getFilter(filter, resourcePath) {
  return (...args) => {
    if (typeof filter === "function") {
      return filter(...args, resourcePath);
    }

    return true;
  };
}

const IS_MODULES = /\.module(s)?\.\w+$/i;
const IS_ICSS = /\.icss\.\w+$/i;

function getModulesOptions(exportType, loaderContext) {
  const resourcePath =
    // eslint-disable-next-line no-underscore-dangle
    loaderContext?._module?.matchResource || loaderContext.resourcePath;

  let auto;
  const rawModulesOptions: any = {};

  const needNamedExport =
    exportType === "css-style-sheet" || exportType === "string";
  const modulesOptions = {
    auto,
    mode: "local",
    localIdentContext: loaderContext.rootContext,
    namedExport: needNamedExport || false,
    exportLocalsConvention:
      (rawModulesOptions.namedExport === true || needNamedExport) &&
      typeof rawModulesOptions.exportLocalsConvention === "undefined"
        ? "camelCaseOnly"
        : "asIs",
    exportOnlyLocals: false,
    ...rawModulesOptions,
  };

  let exportLocalsConventionType;

  if (typeof modulesOptions.exportLocalsConvention === "string") {
    exportLocalsConventionType = modulesOptions.exportLocalsConvention;

    modulesOptions.exportLocalsConvention = (name) => {
      switch (exportLocalsConventionType) {
        case "camelCase": {
          return [name, camelCase(name)];
        }
        case "camelCaseOnly": {
          return camelCase(name);
        }
        case "dashes": {
          return [name, dashesCamelCase(name)];
        }
        case "dashesOnly": {
          return dashesCamelCase(name);
        }
        case "asIs":
        default:
          return name;
      }
    };
  }

  if (typeof modulesOptions.auto === "boolean") {
    const isModules = modulesOptions.auto && IS_MODULES.test(resourcePath);

    let isIcss: boolean = false;

    if (!isModules) {
      isIcss = IS_ICSS.test(resourcePath);

      if (isIcss) {
        modulesOptions.mode = "icss";
      }
    }

    if (!isModules && !isIcss) {
      return false;
    }
  } else if (modulesOptions.auto instanceof RegExp) {
    const isModules = modulesOptions.auto.test(resourcePath);

    if (!isModules) {
      return false;
    }
  } else if (typeof modulesOptions.auto === "function") {
    const isModule = modulesOptions.auto(resourcePath);

    if (!isModule) {
      return false;
    }
  }

  if (typeof modulesOptions.mode === "function") {
    modulesOptions.mode = modulesOptions.mode(loaderContext.resourcePath);
  }

  if (needNamedExport) {
    if (modulesOptions.namedExport === false) {
      throw new Error(
        "The 'exportType' option with the 'css-style-sheet' or 'string' value requires the 'modules.namedExport' option to be enabled"
      );
    }
  }

  if (modulesOptions.namedExport === true) {
    if (
      typeof exportLocalsConventionType === "string" &&
      exportLocalsConventionType !== "camelCaseOnly" &&
      exportLocalsConventionType !== "dashesOnly"
    ) {
      throw new Error(
        'The "modules.namedExport" option requires the "modules.exportLocalsConvention" option to be "camelCaseOnly" or "dashesOnly"'
      );
    }
  }

  return modulesOptions;
}

export function normalizeOptions(rawOptions, loaderContext) {
  const exportType =
    typeof rawOptions.exportType === "undefined"
      ? "array"
      : rawOptions.exportType;
  const modulesOptions = getModulesOptions(exportType, loaderContext);

  return {
    url: typeof rawOptions.url === "undefined" ? true : rawOptions.url,
    import: typeof rawOptions.import === "undefined" ? true : rawOptions.import,
    modules: modulesOptions,
    sourceMap:
      typeof rawOptions.sourceMap === "boolean"
        ? rawOptions.sourceMap
        : loaderContext.sourceMap,
    importLoaders: rawOptions.importLoaders,
    esModule: true,
    exportType,
  };
}

export function shouldUseImportPlugin(options) {
  if (options.modules.exportOnlyLocals) {
    return false;
  }

  if (typeof options.import === "boolean") {
    return options.import;
  }

  return true;
}

export function shouldUseURLPlugin(options) {
  if (options.modules.exportOnlyLocals) {
    return false;
  }

  if (typeof options.url === "boolean") {
    return options.url;
  }

  return true;
}

export function shouldUseIcssPlugin(options) {
  return Boolean(options.modules);
}

export function getModulesPlugins(options, loaderContext) {
  const { mode, localIdentContext } = options.modules;

  try {
    return [
      modulesValues,
      localByDefault({ mode }),
      extractImports(),
      modulesScope({
        generateScopedName(exportName) {
          const localIdent = defaultGetLocalIdent(
            loaderContext,
            unescape(exportName),
            {
              context: localIdentContext,
            }
          );

          return escapeLocalIdent(localIdent).replace(
            /\\\[local\\]/gi,
            exportName
          );
        },
        exportGlobals: false,
      }),
    ];
  } catch (error) {
    loaderContext.emitError(error);
    return [];
  }
}

export function getPreRequester({ loaders, loaderIndex }) {
  const cache = Object.create(null);

  return (number) => {
    if (cache[number]) {
      return cache[number];
    }

    if (number === false) {
      cache[number] = "";
    } else {
      const loadersRequest = loaders
        .slice(
          loaderIndex,
          loaderIndex + 1 + (typeof number !== "number" ? 0 : number)
        )
        .map((x) => x.request)
        .join("!");

      cache[number] = `-!${loadersRequest}!`;
    }

    return cache[number];
  };
}

function dashesCamelCase(str) {
  return str.replace(/-+(\w)/g, (match, firstLetter) =>
    firstLetter.toUpperCase()
  );
}

export async function resolveRequests(resolve, context, possibleRequests) {
  return resolve(context, possibleRequests[0])
    .then((result) => result)
    .catch((error) => {
      const [, ...tailPossibleRequests] = possibleRequests;

      if (tailPossibleRequests.length === 0) {
        throw error;
      }

      return resolveRequests(resolve, context, tailPossibleRequests);
    });
}

export function isURLRequestable(
  url: string,
  options: { isSupportDataURL?: boolean; isSupportAbsoluteURL?: boolean } = {}
) {
  // Protocol-relative URLs
  if (/^\/\//.test(url)) {
    return { requestable: false, needResolve: false };
  }

  // `#` URLs
  if (/^#/.test(url)) {
    return { requestable: false, needResolve: false };
  }

  // Data URI
  if (isDataUrl(url) && options.isSupportDataURL) {
    try {
      decodeURIComponent(url);
    } catch (ignoreError) {
      return { requestable: false, needResolve: false };
    }

    return { requestable: true, needResolve: false };
  }

  // `file:` protocol
  if (/^file:/i.test(url)) {
    return { requestable: true, needResolve: true };
  }

  // Absolute URLs
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !NATIVE_WIN32_PATH.test(url)) {
    if (options.isSupportAbsoluteURL && /^https?:/i.test(url)) {
      return { requestable: true, needResolve: false };
    }

    return { requestable: false, needResolve: false };
  }

  return { requestable: true, needResolve: true };
}

export function sort(a, b) {
  return a.index - b.index;
}

export function combineRequests(preRequest, url) {
  const idx = url.indexOf("!=!");

  return idx !== -1
    ? url.slice(0, idx + 3) + preRequest + url.slice(idx + 3)
    : preRequest + url;
}
