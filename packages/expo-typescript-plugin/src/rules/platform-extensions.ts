import { EXPO_TS_CODES } from "../errors";
import { RuleContext } from "./context";

/*
 * Ensures that route files do not have Platform Extensions.
 */
export function routePlatformExtension({
  prior,
  ts,
  source,
  fileName,
}: RuleContext) {
  const hasPlatformExtension =
    fileName.includes(".web.") ||
    fileName.includes(".native.") ||
    fileName.includes(".ios.") ||
    fileName.includes(".windows.") ||
    fileName.includes(".osx.") ||
    fileName.includes(".android.");

  if (hasPlatformExtension) {
    prior.push({
      file: source,
      category: ts.DiagnosticCategory.Error,
      code: EXPO_TS_CODES.MISSING_ROUTE_EXPORT,
      messageText: `"${fileName}" is not a valid route file. Routes cannot have Platform Extensions.`,
      start: 0,
      length: 0,
    });
  }
}
