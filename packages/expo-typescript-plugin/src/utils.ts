import type tsserverlibrary from "typescript/lib/tsserverlibrary";

export interface Logger {
  info(...messages: string[]): void;
  error(...messages: string[]): void;
}

export function createTSHelpers(ts: typeof tsserverlibrary) {
  return {
    isDefaultFunctionExport(node: ts.Node): node is ts.FunctionDeclaration {
      if (ts.isFunctionDeclaration(node)) {
        let hasExportKeyword = false;
        let hasDefaultKeyword = false;

        if (node.modifiers) {
          for (const modifier of node.modifiers) {
            if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
              hasExportKeyword = true;
            } else if (modifier.kind === ts.SyntaxKind.DefaultKeyword) {
              hasDefaultKeyword = true;
            }
          }
        }

        // `export default function`
        if (hasExportKeyword && hasDefaultKeyword) {
          return true;
        }
      }
      return false;
    },
    isUnstableSettingsExport(node: ts.Node) {
      if (ts.isVariableStatement(node)) {
        return node.declarationList.declarations.some((declaration) => {
          return declaration.name.getText() === "unstable_settings";
        });
      }

      return false;
    },

    createLogger(info: ts.server.PluginCreateInfo): Logger {
      return {
        info(...messages: string[]) {
          info.project.projectService.logger.info(messages.join(" "));
        },
        error(message: string) {
          info.project.projectService.logger.msg(message, ts.server.Msg.Err);
        },
      };
    },
  };
}

export function getFileNameParams(fileName: string) {
  const fileSingleParams = new Set(
    [...fileName.matchAll(/\[(\w+)\]/g)].map((n) => n[1])
  );
  const fileSpreadParams = new Set(
    [...fileName.matchAll(/\[\.\.\.(\w+)\]/g)].map((n) => n[1])
  );

  return { fileSingleParams, fileSpreadParams };
}

export function isRouteFile(filePath: string, appDir: RegExp) {
  return appDir.test(filePath) && !filePath.includes("_layout");
}
