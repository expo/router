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

/*
 * Walk the TypeScript API calling the callback for each node
 *
 * If the callback returns a value, the walk will stop and return that value.
 */
export function walkNode<T>(
  node: ts.Node,
  callback: (node: ts.Node) => T
): T | undefined {
  return ts.forEachChild(node, (child) => {
    const returnEarly = callback(child);
    if (returnEarly) return returnEarly;
    return walkNode(child, callback);
  });
}

/**
 * Finds the closest node to the start/end range
 */
export function findNode(node: ts.Node, start: number, end: number) {
  return walkNode(node, (child) => {
    const $start = child.getStart();
    const $end = child.getEnd();

    if (start >= $start && end <= $end && child.getChildCount() === 0) {
      return child;
    }

    return undefined;
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

export function isRouteFile(filePath: string, appDir: string) {
  return filePath.startsWith(appDir) && !filePath.match(/_layout\.[tj]sx?$/);
}
