import type tsserverlibrary from "typescript/lib/tsserverlibrary";
import type { Diagnostic, SourceFile } from "typescript/lib/tsserverlibrary";

export interface RuleContext {
  ts: typeof tsserverlibrary;
  fileName: string;
  prior: Diagnostic[];
  source: SourceFile;
  Log: Logger;
}
