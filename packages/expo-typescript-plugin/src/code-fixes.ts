import ts from "typescript/lib/tsserverlibrary";
import { NamedImports, SourceFile, TextChange } from "typescript";

export function getReplaceLineSpan(position: number, sourceFile: SourceFile) {
  sourceFile.getLastToken;
  const lineStarts = sourceFile.getLineStarts();
  const line = sourceFile.getLineAndCharacterOfPosition(position).line;
  const end = sourceFile.getLineEndOfPosition(position);
  const start = lineStarts[line];
  const length = end - start;

  return { start, length };
}

export interface GetImportChangesOptions {
  ts: typeof ts;
  module: string;
  identifier: string;
  source: SourceFile;
}

export function getImportTextChange({
  module,
  identifier,
  ts,
  source,
}: GetImportChangesOptions) {
  let change: TextChange | undefined;

  let expoRouterImports: NamedImports | undefined;
  let hasIdentifier = false;

  ts.forEachChild(source, function visit(node) {
    if (!ts.isImportDeclaration(node)) {
      // Stop traversing the tree if we find a node that isn't an import declaration
      return true;
    }

    if (node.moduleSpecifier.getText() !== `"${module}"`) {
      return;
    }

    const bindings = node.importClause?.namedBindings;

    if (!bindings || ts.isNamespaceImport(bindings)) {
      return;
    }

    hasIdentifier = bindings.elements.some((node) => {
      return node.name.getText() === identifier;
    });

    // We found an import that already has this identifier
    if (hasIdentifier) {
      return true;
    }

    return;
  });

  if (!hasIdentifier) {
    if (!expoRouterImports) {
      change = {
        newText: `import { ${identifier} } from "${module}";\n`,
        span: {
          start: 0,
          length: 0,
        },
      };
    } else {
      change = {
        newText: `, ${identifier}`,
        span: {
          start: expoRouterImports.end - 1,
          length: 0,
        },
      };
    }
  }

  return change;
}
