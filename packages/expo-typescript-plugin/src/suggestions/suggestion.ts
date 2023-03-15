import type tsserverlibrary from "typescript/lib/tsserverlibrary";
import {
  SourceFile,
  CodeFixAction,
  LanguageService,
} from "typescript/lib/tsserverlibrary";
import { Logger } from "../utils";

export interface SuggestionContext {
  ts: typeof tsserverlibrary;
  source: SourceFile;
  prior: CodeFixAction[];
  Log: Logger;
  tsLS: LanguageService;
}
