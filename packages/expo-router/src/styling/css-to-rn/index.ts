import {
  Visitor,
  Declaration,
  transform as lightningcss,
  DeclarationBlock,
  CustomAtRules,
} from "lightningcss";

import { parseDeclaration } from "./parseDeclaration";
import { RegisterOptions } from "../types";

interface GetVisitorOptions {
  addStyle(selector: string, rules: Record<string, unknown>): void;
}

/**
 * LightningCSS visitor that converts CSS to React Native styles
 */
export function cssToReactNativeRuntime(css: string) {
  const collection: RegisterOptions = {
    declarations: {},
  };

  lightningcss({
    filename: "style.css", // This is ignored, but required
    code: Buffer.from(css),
    visitor: getVisitor({
      addStyle(selector, rules) {
        collection.declarations![selector] = rules;
      },
    }),
  });

  return collection;
}

function getVisitor({ addStyle }: GetVisitorOptions) {
  const visitor: Visitor<CustomAtRules> = {
    RuleExit(rule) {
      if (rule.type === "style") {
        const style = getStylesFromDeclarationBlock(rule.value.declarations);

        /*
         * Style rules can have multiple selectors, so we need to add a style for each selector
         */
        for (const selectors of rule.value.selectors) {
          for (const selector of selectors) {
            if (selector.type === "class") {
              addStyle(selector.name, style);
            }
          }
        }
      }

      return rule;
    },
  };

  return visitor;
}

function getStylesFromDeclarationBlock(
  declarationBlock: DeclarationBlock<Declaration>
) {
  const ruleRecord: Record<string, any> = {};

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

    // Keep Custom Properties as is, but camelCase other properties
    property = property.startsWith("--")
      ? property
      : property.replace(/-./g, (x) => x[1].toUpperCase());

    if (nullishCoalescing) {
      ruleRecord[property] ??= value;
    } else {
      ruleRecord[property] = value;
    }
  }

  for (const declaration of declarationArray) {
    parseDeclaration(declaration, addStyleProp);
  }

  return ruleRecord;
}
