import { EXPO_TS_CODES } from "../errors";
import { RuleContext } from "./context";

/*
 * All route files must have a default export.
 */
export function routeDefaultExport(
  hasDefaultExpo: boolean,
  { prior, ts, source, fileName }: RuleContext
) {
  if (!hasDefaultExpo) {
    prior.push({
      file: source,
      category: ts.DiagnosticCategory.Error,
      code: EXPO_TS_CODES.MISSING_ROUTE_EXPORT,
      messageText: `"${fileName}" is not a valid route file. Please add a default export.`,
      start: 0,
      length: 0,
    });
  }
}
