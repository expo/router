import {
  Declaration,
  transform as lightningcss,
  DeclarationBlock,
  MediaQuery,
  MediaRule,
  SelectorList,
  Rule,
} from "lightningcss";

import { ParseDeclarationOptions, parseDeclaration } from "./parseDeclaration";
import { isRuntimeValue } from "../runtime/native/guards";
import { ExtractedStyle, StyleSheetRegisterOptions } from "../types";

export type CssToReactNativeRuntimeOptions = ParseDeclarationOptions;

/*
 * Converts a CSS file to a collection of style declarations that can be used with the StyleSheet API
 */
export function cssToReactNativeRuntime(
  code: Buffer,
  options: CssToReactNativeRuntimeOptions = {}
): StyleSheetRegisterOptions {
  const declarations = new Map<string, ExtractedStyle | ExtractedStyle[]>();

  lightningcss({
    filename: "style.css", // This is ignored, but required
    code,
    visitor: {
      Rule(rule) {
        extractRule(rule, { declarations }, options);
        // We have processed this rule, so now delete it from the AST
        return [];
      },
    },
  });

  return {
    declarations: Object.fromEntries(declarations),
  };
}

interface ExtractRuleOptions {
  // The collection of declarations that have been extracted so far
  // This should be mutated
  declarations: Map<string, ExtractedStyle | ExtractedStyle[]>;
  // Rules may be inside other rules, such as media queries.
  // We can build this this partial rule object as we traverse the tree
  style?: Partial<ExtractedStyle>;
}

function extractRule(
  rule: Rule,
  extractOptions: ExtractRuleOptions,
  parseOptions: ParseDeclarationOptions
) {
  switch (rule.type) {
    case "media": {
      extractMedia(rule.value, extractOptions, parseOptions);
      break;
    }
    case "style": {
      if (rule.value.declarations) {
        setStyleForSelectorList(
          {
            ...extractOptions.style,
            ...getExtractedStyle(rule.value.declarations, parseOptions),
          },
          rule.value.selectors,
          extractOptions.declarations
        );
      }
      break;
    }
  }
}

/*
 * Extracts styles from a media query
 */
function extractMedia(
  mediaRule: MediaRule,
  extractOptions: ExtractRuleOptions,
  parseOptions: ParseDeclarationOptions
) {
  const media: MediaQuery[] = [];

  // We only want to extract styles for screen media queries
  for (const mediaQuery of mediaRule.query.mediaQueries) {
    let isScreen = mediaQuery.mediaType !== "print";
    if (mediaQuery.qualifier === "not") {
      isScreen = !isScreen;
    }

    if (isScreen) {
      media.push(mediaQuery);
    }
  }

  // If there are no screen media queries, we don't need to extract anything
  if (media.length === 0) {
    return;
  }

  const newExtractOptions: ExtractRuleOptions = {
    ...extractOptions,
    style: {
      media,
    },
  };

  for (const rule of mediaRule.rules) {
    extractRule(rule, newExtractOptions, parseOptions);
  }

  return undefined;
}

function setStyleForSelectorList(
  style: ExtractedStyle,
  selectorList: SelectorList,
  declarations: ExtractRuleOptions["declarations"]
) {
  for (const selectors of selectorList) {
    for (const selector of selectors) {
      if (selector.type === "class") {
        const existing = declarations.get(selector.name);

        if (Array.isArray(existing)) {
          existing.push(style);
        } else if (existing) {
          declarations.set(selector.name, [existing, style]);
        } else {
          declarations.set(selector.name, style);
        }
      }
    }
  }
}

function getExtractedStyle(
  declarationBlock: DeclarationBlock<Declaration>,
  options: ParseDeclarationOptions
): ExtractedStyle {
  const style: Record<string, any> = {};
  const runtimeStyleProps: string[] = [];
  const variableProps: string[] = [];

  const declarationArray = [
    declarationBlock.declarations,
    declarationBlock.importantDeclarations,
  ]
    .flat()
    .filter((d): d is Declaration => !!d);

  /*
   * Adds a style property to the rule record.
   *
   * The shorthand option handles if the style came from a long or short hand property
   * E.g. `margin` is a shorthand property for `margin-top`, `margin-bottom`, `margin-left` and `margin-right`
   *
   * The `append` option allows the same property to be added multiple times
   * E.g. `transform` accepts an array of transforms
   */
  function addStyleProp(
    property: string,
    value: any,
    { shortHand = false, append = false } = {}
  ) {
    if (value === undefined) {
      return;
    }

    if (property.startsWith("--")) {
      variableProps.push(property);
    } else {
      // RN styles need to be camelCase
      property = property.replace(/-./g, (x) => x[1].toUpperCase());
    }

    if (append) {
      if (Array.isArray(style[property])) {
        style[property].push(...value);
      } else {
        style[property] = [value];
      }
    } else if (shortHand) {
      // If the shorthand property has already been set, don't overwrite it
      // The longhand property always have priority
      style[property] ??= value;
    } else {
      style[property] = value;
    }

    if (isRuntimeValue(value)) {
      runtimeStyleProps.push(property);
    }
  }

  for (const declaration of declarationArray) {
    parseDeclaration(declaration, addStyleProp, options);
  }

  return {
    runtimeStyleProps,
    variableProps,
    style,
  };
}
