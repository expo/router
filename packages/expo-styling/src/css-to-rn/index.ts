import {
  KeyframesRule,
  Animation,
  Declaration,
  transform as lightningcss,
  DeclarationBlock,
  MediaQuery,
  MediaRule,
  SelectorList,
  Rule,
  ContainerType,
  ContainerRule,
  Selector,
} from "lightningcss";

import { isRuntimeValue } from "../shared";
import {
  ExtractedContainerQuery,
  ExtractedStyle,
  StyleSheetRegisterOptions,
  AnimatableCSSProperty,
  ExtractedAnimation,
} from "../types";
import { ParseDeclarationOptions, parseDeclaration } from "./parseDeclaration";
import { exhaustiveCheck } from "./utils";

export type CssToReactNativeRuntimeOptions = {
  inlineRem?: number | false;
  grouping?: (string | RegExp)[];
};

/*
 * Converts a CSS file to a collection of style declarations that can be used with the StyleSheet API
 */
export function cssToReactNativeRuntime(
  code: Buffer,
  options: CssToReactNativeRuntimeOptions = {}
): StyleSheetRegisterOptions {
  const declarations = new Map<string, ExtractedStyle | ExtractedStyle[]>();
  const keyframes = new Map<string, ExtractedAnimation>();

  const grouping =
    options.grouping?.map((value) => {
      return typeof value === "string" ? new RegExp(value) : value;
    }) ?? [];

  lightningcss({
    filename: "style.css", // This is ignored, but required
    code,
    visitor: {
      Rule(rule) {
        extractRule(
          rule,
          { ...options, grouping, declarations, keyframes },
          options
        );
        // We have processed this rule, so now delete it from the AST
        return [];
      },
    },
  });

  return {
    declarations: Object.fromEntries(declarations),
    keyframes: Object.fromEntries(keyframes),
  };
}

interface ExtractRuleOptions {
  // The collection of declarations that have been extracted so far. This should be mutated
  declarations: Map<string, ExtractedStyle | ExtractedStyle[]>;
  // The collection animations declarations that have been extracted so far. This should be mutated
  keyframes: Map<string, ExtractedAnimation>;
  // Rules may be inside other rules, such as media queries.
  // We can build this this partial rule object as we traverse the tree
  style?: Partial<ExtractedStyle>;
  grouping?: RegExp[];
}

function extractRule(
  rule: Rule,
  extractOptions: ExtractRuleOptions,
  parseOptions: CssToReactNativeRuntimeOptions
) {
  switch (rule.type) {
    case "keyframes": {
      extractKeyFrames(rule.value, extractOptions, parseOptions);
      break;
    }
    case "container": {
      extractedContainer(rule.value, extractOptions, parseOptions);
      break;
    }
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
          extractOptions
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
  parseOptions: CssToReactNativeRuntimeOptions
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

function extractedContainer(
  containerRule: ContainerRule,
  extractOptions: ExtractRuleOptions,
  parseOptions: CssToReactNativeRuntimeOptions
) {
  const newExtractOptions: ExtractRuleOptions = {
    ...extractOptions,
    style: {
      containerQuery: [
        {
          name: containerRule.name,
          condition: containerRule.condition,
        },
      ],
    },
  };

  for (const rule of containerRule.rules) {
    extractRule(rule, newExtractOptions, parseOptions);
  }
  return undefined;
}

function setStyleForSelectorList(
  style: ExtractedStyle,
  selectorList: SelectorList,
  { declarations, grouping = [] }: ExtractRuleOptions
) {
  for (const selector of selectorList) {
    // There maybe multiple className selectors. The last one is the one we want to use
    // The others are conditions
    const classSelectorIndex = findLastIndex(
      selector,
      (s) => s.type === "class"
    );

    // No class selecor, so we can't extract anything
    if (classSelectorIndex === -1) {
      continue;
    }

    const conditions = groupSelector(selector.slice(0, classSelectorIndex));

    const conditionValid = conditions.every((c) => {
      return grouping.some((g) => g.test(c.className));
    });

    if (!conditionValid) {
      continue;
    }

    // These conditions need to be added to the declarations
    for (const condition of conditions) {
      addDeclaration(
        condition.className,
        {
          style: {},
          container: {
            names: [condition.className],
          },
        },
        declarations
      );
    }

    let containerQueries = style.containerQuery;

    if (conditions.length > 0) {
      containerQueries ??= [];

      for (const condition of conditions) {
        const containerQuery: ExtractedContainerQuery = {
          name: condition.className,
          pseudoClasses: condition.pseudoClasses,
        };

        containerQueries.push(containerQuery);
      }
    }

    const groupedDelecarationSelectors = groupSelector(
      selector.slice(classSelectorIndex)
    );

    // We started at the last className, but that doesn't guarentee that we will get a single
    // groupSelector. If we get anything else but one, ignore this selector
    if (groupedDelecarationSelectors.length !== 1) {
      continue;
    }

    const [{ className, pseudoClasses }] = groupedDelecarationSelectors;

    addDeclaration(
      className,
      { ...style, pseudoClasses, containerQuery: containerQueries },
      declarations
    );
  }
}

function addDeclaration(
  className: string,
  style: ExtractedStyle,
  declarations: ExtractRuleOptions["declarations"]
) {
  const existing = declarations.get(className);

  if (Array.isArray(existing)) {
    existing.push(style);
  } else if (existing) {
    declarations.set(className, [existing, style]);
  } else {
    declarations.set(className, style);
  }
}

type GroupedSelector = {
  className: string;
  pseudoClasses?: Record<string, true>;
};

function groupSelector(selectors: Selector) {
  let current: GroupedSelector | undefined;
  const groupedSelectors: GroupedSelector[] = [];

  for (const selector of selectors) {
    switch (selector.type) {
      case "combinator":
      case "universal":
      case "namespace":
      case "type":
      case "id":
      case "pseudo-element":
      case "nesting":
      case "attribute":
        current = undefined;
        break;
      case "class":
        // Selectors like .foo.bar are not valid
        if (current?.className) {
          groupedSelectors.pop();
          return [];
        } else {
          current = {
            className: selector.name,
          };
          groupedSelectors.push(current);
        }
        break;
      case "pseudo-class":
        switch (selector.kind) {
          case "hover":
          case "active":
          case "focus":
            if (!current) break;
            current.pseudoClasses ??= {};
            current.pseudoClasses[selector.kind] = true;
            break;
          case "not":
          case "first-child":
          case "last-child":
          case "only-child":
          case "root":
          case "empty":
          case "scope":
          case "nth-child":
          case "nth-last-child":
          case "nth-col":
          case "nth-last-col":
          case "nth-of-type":
          case "nth-last-of-type":
          case "first-of-type":
          case "last-of-type":
          case "only-of-type":
          case "host":
          case "where":
          case "is":
          case "any":
          case "has":
          case "lang":
          case "dir":
          case "focus-visible":
          case "focus-within":
          case "current":
          case "past":
          case "future":
          case "playing":
          case "paused":
          case "seeking":
          case "buffering":
          case "stalled":
          case "muted":
          case "volume-locked":
          case "fullscreen":
          case "defined":
          case "any-link":
          case "link":
          case "local-link":
          case "target":
          case "target-within":
          case "visited":
          case "enabled":
          case "disabled":
          case "read-only":
          case "read-write":
          case "placeholder-shown":
          case "default":
          case "checked":
          case "indeterminate":
          case "blank":
          case "valid":
          case "invalid":
          case "in-range":
          case "out-of-range":
          case "required":
          case "optional":
          case "user-valid":
          case "user-invalid":
          case "autofill":
          case "local":
          case "global":
          case "webkit-scrollbar":
          case "custom":
          case "custom-function":
            break;
        }
        break;
    }
  }

  return groupedSelectors;
}

function extractKeyFrames(
  keyframes: KeyframesRule<Declaration>,
  extractOptions: ExtractRuleOptions,
  options: CssToReactNativeRuntimeOptions
) {
  const extractedAnimation: ExtractedAnimation = { frames: [] };
  const frames = extractedAnimation.frames;

  for (const frame of keyframes.keyframes) {
    const { style } = getExtractedStyle(frame.declarations, {
      ...options,
      requiresLayout() {
        extractedAnimation.requiresLayout = true;
      },
    });

    for (const selector of frame.selectors) {
      const keyframe =
        selector.type === "percentage"
          ? selector.value * 100
          : selector.type === "from"
          ? 0
          : selector.type === "to"
          ? 100
          : undefined;

      if (keyframe === undefined) continue;

      switch (selector.type) {
        case "percentage":
          frames.push({ selector: selector.value, style });
          break;
        case "from":
          frames.push({ selector: 0, style });
          break;
        case "to":
          frames.push({ selector: 1, style });
          break;
        default:
          exhaustiveCheck(selector);
      }
    }
  }

  // Ensure there are always two frames, a start and end
  if (frames.length === 1) {
    frames.push({ selector: 0, style: {} });
  }

  extractedAnimation.frames = frames.sort((a, b) => a.selector - b.selector);

  extractOptions.keyframes.set(keyframes.name.value, extractedAnimation);
}

interface GetExtractedStyleOptions extends CssToReactNativeRuntimeOptions {
  requiresLayout?: () => void;
}

function getExtractedStyle(
  declarationBlock: DeclarationBlock<Declaration>,
  options: GetExtractedStyleOptions
): ExtractedStyle {
  const extrtactedStyle: ExtractedStyle = {
    style: {},
  };

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
      return addVariable(property, value);
    }

    property = kebabToCamelCase(property);

    const style = extrtactedStyle.style;

    if (append) {
      const styleValue = style[property];
      if (Array.isArray(styleValue)) {
        styleValue.push(...value);
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
      extrtactedStyle.isDynamic = true;
    }
  }

  function addVariable(property: string, value: any) {
    extrtactedStyle.variables ??= {};
    extrtactedStyle.variables[property] = value;
  }

  function addContainerProp(
    declaration: Extract<
      Declaration,
      { property: "container" | "container-name" | "container-type" }
    >
  ) {
    let names: false | string[] = false;
    let type: ContainerType | undefined;

    switch (declaration.property) {
      case "container":
        if (declaration.value.name.type === "none") {
          names = false;
        } else {
          names = declaration.value.name.value;
        }
        type = declaration.value.containerType;
        break;
      case "container-name":
        if (declaration.value.type === "none") {
          names = false;
        } else {
          names = declaration.value.value;
        }
        break;
      case "container-type":
        type = declaration.value;
        break;
    }

    if (names === false) {
      return;
    }

    if (names) {
      extrtactedStyle.container ??= {};
      extrtactedStyle.container.names = names;
    }

    if (type) {
      extrtactedStyle.container ??= {};
      extrtactedStyle.container.type = type;
    }
  }

  function addTransitionProp(
    declaration: Extract<
      Declaration,
      {
        property:
          | "transition-property"
          | "transition-duration"
          | "transition-delay"
          | "transition-timing-function"
          | "transition";
      }
    >
  ) {
    extrtactedStyle.transition ??= {};

    switch (declaration.property) {
      case "transition-property":
        extrtactedStyle.transition.property = declaration.value.map((v) => {
          return kebabToCamelCase(v.property) as AnimatableCSSProperty;
        });
        break;
      case "transition-duration":
        extrtactedStyle.transition.duration = declaration.value;
        break;
      case "transition-delay":
        extrtactedStyle.transition.delay = declaration.value;
        break;
      case "transition-timing-function":
        extrtactedStyle.transition.timingFunction = declaration.value;
        break;
      case "transition": {
        let setProperty = true;
        let setDuration = true;
        let setDelay = true;
        let setTiming = true;

        // Shorthand properties cannot override the longhand property
        // So we skip setting the property if it already exists
        // Otherwise, we need to set the property to an empty array

        if (extrtactedStyle.transition.property) {
          setProperty = false;
        } else {
          extrtactedStyle.transition.property = [];
        }
        if (extrtactedStyle.transition.duration) {
          setDuration = false;
        } else {
          extrtactedStyle.transition.duration = [];
        }
        if (extrtactedStyle.transition.delay) {
          setDelay = false;
        } else {
          extrtactedStyle.transition.delay = [];
        }
        if (extrtactedStyle.transition.timingFunction) {
          setTiming = false;
        } else {
          extrtactedStyle.transition.timingFunction = [];
        }

        // Loop through each transition value and only set the properties that
        // were not already set by the longhand property
        for (const value of declaration.value) {
          if (setProperty) {
            extrtactedStyle.transition.property?.push(
              kebabToCamelCase(value.property.property) as AnimatableCSSProperty
            );
          }
          if (setDuration) {
            extrtactedStyle.transition.duration?.push(value.duration);
          }
          if (setDelay) {
            extrtactedStyle.transition.delay?.push(value.delay);
          }
          if (setTiming) {
            extrtactedStyle.transition.timingFunction?.push(
              value.timingFunction
            );
          }
        }
        break;
      }
    }
  }

  function addAnimationProp(property: string, value: any) {
    if (property === "animation") {
      const groupedProperties: Record<string, any[]> = {};

      for (const animation of value as Animation[]) {
        for (const [key, value] of Object.entries(animation)) {
          groupedProperties[key] ??= [];
          groupedProperties[key].push(value);
        }
      }

      extrtactedStyle.animations ??= {};
      for (const [property, value] of Object.entries(groupedProperties)) {
        const key = property
          .replace("animation-", "")
          .replace(/-./g, (x) => x[1].toUpperCase()) as keyof Animation;

        extrtactedStyle.animations[key] ??= value;
      }
    } else {
      const key = property
        .replace("animation-", "")
        .replace(/-./g, (x) => x[1].toUpperCase()) as keyof Animation;

      extrtactedStyle.animations ??= {};
      extrtactedStyle.animations[key] = value;
    }
  }

  function requiresLayout() {
    extrtactedStyle.requiresLayout = true;
  }

  const parseDeclarationOptions: ParseDeclarationOptions = {
    addStyleProp,
    addAnimationProp,
    addContainerProp,
    addTransitionProp,
    requiresLayout,
    ...options,
  };

  for (const declaration of declarationArray) {
    parseDeclaration(declaration, parseDeclarationOptions);
  }

  return extrtactedStyle;
}

function findLastIndex<T>(array: T[], predicate: (arg: T) => boolean) {
  for (let index = array.length - 1; index >= 0; index--) {
    if (predicate(array[index])) {
      return index;
    }
  }
  return -1;
}

function kebabToCamelCase(str: string) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
