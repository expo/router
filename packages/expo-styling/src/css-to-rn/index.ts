import {
  Visitor,
  Declaration,
  transform as lightningcss,
  DeclarationBlock,
  CustomAtRules,
  MediaQuery,
} from "lightningcss";

import { parseDeclaration } from "./parseDeclaration";
import { isRuntimeValue } from "../runtime/native/guards";
import { ExtractedStyle, StyleSheetRegisterOptions } from "../types";

interface GetVisitorOptions {
  declarations: Map<string, ExtractedStyle | ExtractedStyle[]>;
}

/**
 * LightningCSS visitor that converts CSS to React Native styles
 */
export function cssToReactNativeRuntime(
  css: string
): StyleSheetRegisterOptions {
  const declarations = new Map<string, ExtractedStyle | ExtractedStyle[]>();

  lightningcss({
    filename: "style.css", // This is ignored, but required
    code: Buffer.from(css),
    visitor: getVisitor({
      declarations,
    }),
  });

  return {
    declarations: Object.fromEntries(declarations),
  };
}

function getVisitor({ declarations }: GetVisitorOptions) {
  let currentMediaQuery: MediaQuery | undefined;

  const visitor: Visitor<CustomAtRules> = {
    RuleExit(rule) {
      if (rule.type === "style") {
        let style = getExtractedStyle(rule.value.declarations);

        if (currentMediaQuery) {
          style = {
            media: currentMediaQuery,
            ...style,
          };
        }

        /*
         * Style rules can have multiple selectors, so we need to add a style for each selector
         */
        for (const selectors of rule.value.selectors) {
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
    },
    MediaQuery(mediaQuery) {
      let isScreen = mediaQuery.mediaType !== "print";

      if (mediaQuery.qualifier === "not") {
        isScreen = !isScreen;
      }

      if (isScreen) {
        currentMediaQuery = mediaQuery;
      }
    },
    MediaQueryExit() {
      currentMediaQuery = undefined;
    },
  };

  return visitor;
}

function getExtractedStyle(
  declarationBlock: DeclarationBlock<Declaration>
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
   * Adds a style property to the rule record. Use nullish coalescing to control setting shorthand vs longhand
   *
   * For example, margin-right should use `nullishCoalescing=false`, but margin should use `true`
   * This is because margin-right is a longhand property of margin, so it should override the shorthand
   *
   * @param property - the property name
   * @param value - the property value
   * @param nullishCoalescing - whether to use nullish coalescing to set the property
   */
  function addStyleProp(
    property: string,
    value: unknown,
    nullishCoalescing = false
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

    if (nullishCoalescing) {
      style[property] ??= value;
    } else {
      style[property] = value;
    }

    if (isRuntimeValue(value)) {
      runtimeStyleProps.push(property);
    }
  }

  for (const declaration of declarationArray) {
    parseDeclaration(declaration, addStyleProp);
  }

  return {
    runtimeStyleProps,
    variableProps,
    style,
  };
}
