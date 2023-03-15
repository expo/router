import type tsserverlibrary from "typescript/lib/tsserverlibrary";
import { LanguageService } from "typescript/lib/tsserverlibrary";

import { createTSHelpers, isRouteFile } from "./utils";
import { RuleContext } from "./rules/context";
import { routePlatformExtension } from "./rules/platform-extensions";
import { routeDefaultExport } from "./rules/route-default-export";
import {
  typedSettingCodeAction,
  typedSettingSuggestion,
} from "./suggestions/settings";

interface InitOptions {
  typescript: typeof tsserverlibrary;
}

function init({ typescript: ts }: InitOptions) {
  function create(info: ts.server.PluginCreateInfo): LanguageService {
    const { languageService: tsLS } = info;
    const { isDefaultFunctionExport, createLogger } = createTSHelpers(ts);

    const Log = createLogger(info);

    Log.info("Starting Expo TypeScript plugin");

    const projectDir = info.project.getCurrentDirectory();

    // TODO: Should use EXPO_ROUTER config here
    const appDir = new RegExp(
      `^${projectDir}(/src)?/app`.replace(/[\\/]/g, "[\\/]")
    );

    Log.info("Expo Project Directory", projectDir);

    const expoLS: Partial<LanguageService> = {
      /**
       * Issues with the semantic implementation of Expo Router
       * e.g. forgetting a default export on a route.
       */
      getSemanticDiagnostics(fileName) {
        const prior = tsLS.getSemanticDiagnostics(fileName);

        // Ensure this file is inside our `app/` directory
        if (!isRouteFile(fileName, appDir)) return prior;

        const source = tsLS.getProgram()?.getSourceFile(fileName)!;

        const ruleContext: RuleContext = {
          ts,
          fileName,
          source,
          prior,
          Log,
        };

        let hasDefaultExpo = false;

        ts.forEachChild(source, (node) => {
          if (isDefaultFunctionExport(node)) {
            hasDefaultExpo = true;
          }
        });

        routeDefaultExport(hasDefaultExpo, ruleContext);
        routePlatformExtension(ruleContext);

        return prior;
      },
      getSuggestionDiagnostics(fileName) {
        const prior = tsLS.getSuggestionDiagnostics(fileName);

        // Ensure this file is inside our `app/` directory
        if (!isRouteFile(fileName, appDir)) return prior;

        const source = tsLS.getProgram()?.getSourceFile(fileName)!;

        const ruleContext: RuleContext = {
          ts,
          fileName,
          source,
          prior,
          Log,
        };

        ts.forEachChild(source, (node) => {
          typedSettingSuggestion(node, ruleContext);
        });

        return prior;
      },
      getCodeFixesAtPosition(fileName, ...args) {
        const prior = [...tsLS.getCodeFixesAtPosition(fileName, ...args)];

        const source = tsLS.getProgram()?.getSourceFile(fileName)!;

        const context = { prior, Log, ts, tsLS, source };

        typedSettingCodeAction(context, fileName, ...args);

        Log.info("getCodeFixesAtPosition", JSON.stringify(prior, null, 2));
        return prior;
      },
    };

    tsLS.getCombinedCodeFix;

    return { ...tsLS, ...expoLS };
  }

  return { create };
}

export = init;
