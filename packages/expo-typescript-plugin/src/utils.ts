import ts from "typescript/lib/tsserverlibrary";

type tsserverlibrary = typeof ts;

export interface Logger {
  info(...messages: (string | number | undefined)[]): void;
  error(...messages: (string | number | undefined)[]): void;
}

export function createTSHelpers(ts: tsserverlibrary) {
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

export function walkNode(node: ts.Node, callback: (node: ts.Node) => void) {
  ts.forEachChild(node, (child) => {
    callback(child);
    walkNode(child, callback);
  });
}

export function findNode(
  node: ts.Node,
  start: number,
  end: number
): ts.Node | undefined {
  return ts.forEachChild(node, (child) => {
    const $start = child.getStart();
    const $end = child.getEnd();

    if (start >= $start && end <= $end && child.getChildCount() === 0) {
      return child;
    } else {
      return findNode(child, start, end);
    }
  });
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
