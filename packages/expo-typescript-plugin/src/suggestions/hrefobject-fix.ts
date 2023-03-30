import ts, {
  DiagnosticCategory,
  FormatCodeSettings,
  TextChange,
  UserPreferences,
} from "typescript";

import { SuggestionContext } from "./types";
import { EXPO_TS_CODES } from "../errors";
import { RuleContext } from "../rules/context";
import { findNode } from "../utils";

export const CAPTURE_DYNAMIC_PARAMS = /\[(?:\.{3})?(\w*?)[\]$]/g;

export function hrefSuggestion(
  node: ts.Node,
  { prior, ts, source }: RuleContext
) {
  if (
    !(ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) ||
    node.tagName.getText() !== "Link"
  ) {
    return;
  }

  const href = node.attributes.properties.find(
    (property) => property.name?.getText() === "href"
  );

  if (!href || !ts.isJsxAttribute(href)) {
    return;
  }

  const routeName = href.initializer?.getText();

  if (routeName && !routeName.startsWith("{") && routeName?.includes("[")) {
    const start = href.getStart();
    const end = href.getEnd();

    prior.push({
      category: DiagnosticCategory.Suggestion,
      code: EXPO_TS_CODES.HREF_DYNAMIC_STRING,
      messageText: "Change to HrefObject",
      file: source,
      start,
      length: end - start,
    });
  }
}

export function hrefSuggestionCodeAction(
  { prior, source, Log }: SuggestionContext,
  fileName: string,
  start: number,
  end: number,
  errorCodes: readonly number[],
  _formatOptions: FormatCodeSettings,
  _preferences: UserPreferences
) {
  Log.info("blah", ...errorCodes);
  if (errorCodes.indexOf(EXPO_TS_CODES.HREF_DYNAMIC_STRING) === -1) {
    return;
  }

  const hrefNode = findNode(source, start, end)?.parent;

  if (!hrefNode || !ts.isJsxAttribute(hrefNode)) return;

  const initializer = hrefNode.initializer;

  if (!initializer) return;

  const route = hrefNode.initializer.getText();
  const params = [...route.matchAll(CAPTURE_DYNAMIC_PARAMS)].map(
    (match) => match[1]
  );
  const paramsObjString = params.map((p) => `"${p}": ""`).join(",\n");

  const textChange: TextChange = {
    span: {
      start: initializer.getStart(),
      length: initializer.getEnd() - initializer.getStart(),
    },
    newText: `{{ pathname: ${route}, params: {${paramsObjString}}}}`,
  };

  prior.push({
    fixName: "expo-router_suggestion_href",
    description: "Change to HrefObject [Expo Router]",
    changes: [
      {
        fileName,
        textChanges: [textChange],
      },
    ],
  });
}
