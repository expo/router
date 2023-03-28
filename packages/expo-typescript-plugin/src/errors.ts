/**
 * These are made up?
 * @see: https://github.com/microsoft/TypeScript/blob/86019fa470a1344cd9bb6879b04fed357bae2562/src/compiler/diagnosticMessages.json
 *
 * We will leave this range 0-99000 for internal errors.
 * Expo was founded in 2013, so our range will be 1300000-1399999
 * The format is `13${Class}${Category}${000-999}
 *
 * Classes:
 *   Error: 1
 *   Suggestion: 2
 *
 * Categories:
 *   Route files: 1
 *   Route files: 2
 *
 */

export const EXPO_TS_CODES = {
  /**
   * Errors
   */
  // Route files
  MISSING_ROUTE_EXPORT: 1311000,
  /**
   * Suggestions
   */
  // Route files
  FIX_SETTINGS_TYPE: 1321000,
  // Components
  HREF_DYNAMIC_STRING: 1322000,
};
