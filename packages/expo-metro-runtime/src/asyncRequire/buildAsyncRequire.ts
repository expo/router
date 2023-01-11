import { loadBundleAsync } from "./loadBundle";

type ImportBundleNames = Record<string, string> & {
  __proto__: null;
};

type MetroRequire = {
  (id: number): any;
  importAll: (id: number) => any;
};

type ImportBundlePromises = Record<string, Promise<any>> & {
  __proto__?: null;
};

/**
 * Must satisfy the requirements of the Metro bundler.
 * https://github.com/facebook/metro/blob/f9fe277986ff7e7e53ae0418040f3aa1eb1c7056/packages/metro/src/ModuleGraph/worker/collectDependencies.js#L629-L639
 *
 * And https://github.com/facebook/metro/blob/fc29a1177f883144674cf85a813b58567f69d545/packages/metro/src/lib/getAppendScripts.js#L54-L56
 */
type AsyncRequire = {
  <TModule>(
    moduleID: number,
    moduleName?: string,
    options?: { isPrefetchOnly: boolean }
  ): Promise<TModule | void> | TModule;
  prefetch(moduleID: number, moduleName: string): void;
  /** NOTE(EvanBacon): Unclear what this should return `__jsResource` ?? */
  resource(moduleID: number, moduleName: string): never;

  /** Register the 'moduleID<>bundle path' that can be loaded via `asyncRequire(moduleID)` */
  addImportBundleNames(names: Record<string, string>): void;
};

/** Create an `asyncRequire` function in the expected shape for Metro bundler. */
export function buildAsyncRequire(metroRequire: MetroRequire): AsyncRequire {
  const importBundleNames: ImportBundleNames = Object.create(null);
  const importBundlePromises: ImportBundlePromises = Object.create(null);

  // This is basically `__webpack_require__.u` -> returns the bundle path for a numeric moduleID
  function getBundlePath(moduleID: string): string | undefined {
    return importBundleNames[moduleID];
  }

  function asyncRequire<TModule>(
    moduleID: number,
    moduleName: string = "",
    options: { isPrefetchOnly: boolean } = { isPrefetchOnly: false }
  ): Promise<TModule | void> | TModule {
    if (options.isPrefetchOnly) {
      return Promise.resolve();
    }

    const stringModuleID = String(moduleID);
    const bundlePath = getBundlePath(stringModuleID);
    if (bundlePath) {
      // Prevent loading the same module more than once.
      if (!importBundlePromises[stringModuleID]) {
        importBundlePromises[stringModuleID] = loadBundleAsync(bundlePath).then(
          () => metroRequire(moduleID)
        );
      }
      // Return for the user to resolve.
      return importBundlePromises[stringModuleID];
    }

    return metroRequire.importAll(moduleID);
  }

  asyncRequire.prefetch = function (
    moduleID: number,
    moduleName: string
  ): void {
    const result = asyncRequire(moduleID, moduleName, { isPrefetchOnly: true });
    if (result instanceof Promise) {
      result.then(
        () => {},
        () => {}
      );
    }
  };

  asyncRequire.resource = function (
    moduleID: number,
    moduleName: string
  ): never {
    throw new Error("Unimplemented Metro runtime feature");
  };

  /**
   * Register modules that can be loaded async.
   * Key is a numeric string and value is a string denoting the bundle path.
   *
   * @example { '1': 'Second' }
   */
  asyncRequire.addImportBundleNames = function (
    names: Record<string, string>
  ): void {
    Object.assign(importBundleNames, names);
  };

  return asyncRequire;
}
