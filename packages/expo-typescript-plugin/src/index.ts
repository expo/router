import path from "path";
import ts, { LanguageService } from "typescript/lib/tsserverlibrary";

import { RuleContext } from "./rules/context";
import { routePlatformExtension } from "./rules/platform-extensions";
import { routeDefaultExport } from "./rules/route-default-export";
import {
  hrefSuggestion,
  hrefSuggestionCodeAction,
} from "./suggestions/hrefobject-fix";
import {
  typedSettingCodeAction,
  typedSettingSuggestion,
} from "./suggestions/settings-type-fix";
import { createTSHelpers, isRouteFile, walkNode } from "./utils";

interface InitOptions {
  typescript: typeof ts;
}

function init({ typescript: ts }: InitOptions) {
  function create(info: ts.server.PluginCreateInfo): LanguageService {
    const { languageService: tsLS } = info;
    const { isDefaultFunctionExport, createLogger } = createTSHelpers(ts);

    const Log = createLogger(info);

    Log.info("Starting Expo TypeScript plugin");

    const projectDir = info.project.getCurrentDirectory();
    const appDir = path.join(projectDir, "./app");

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
          appDir,
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
          appDir,
        };

        walkNode(source, (node) => {
          typedSettingSuggestion(node, ruleContext);
          hrefSuggestion(node, ruleContext);
        });

        return prior;
      },
      getCodeFixesAtPosition(fileName, ...args) {
        const prior = [...tsLS.getCodeFixesAtPosition(fileName, ...args)];

        const source = tsLS.getProgram()?.getSourceFile(fileName)!;

        const context = { prior, Log, ts, tsLS, source, appDir };

        typedSettingCodeAction(context, fileName, ...args);
        hrefSuggestionCodeAction(context, fileName, ...args);

        return prior;
      },
    };

    return { ...tsLS, ...expoLS };
  }

  return { create };
}

export = init;
