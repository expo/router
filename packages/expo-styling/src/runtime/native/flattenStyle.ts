import { isRuntimeValue } from "../../shared";
import { Interaction, Style, StyleMeta, StyleProp } from "../../types";
import {
  testContainerQuery,
  testMediaQuery,
  testPseudoClasses,
} from "./conditions";
import { rem, styleMetaMap, vh, vw } from "./globals";

export interface FlattenStyleOptions {
  variables: Record<string, any>;
  interaction?: Interaction;
  containers?: Record<string, any>;
  ch?: number;
  cw?: number;
}

/**
 * Reduce a StyleProp to a flat Style object.
 * As we loop over keys & values, we will resolve any dynamic values.
 * Some values cannot be calculated until the entire style has been flattened.
 * These values are defined as a getter and will be resolved lazily
 */
export function flattenStyle(
  styles: StyleProp,
  options: FlattenStyleOptions,
  flatStyle?: Style
): Style {
  let flatStyleMeta: StyleMeta;

  if (!flatStyle) {
    flatStyle = {};
    flatStyleMeta = {};
    styleMetaMap.set(flatStyle, flatStyleMeta);
  } else {
    flatStyleMeta = styleMetaMap.get(flatStyle) ?? {};
  }

  if (!styles) {
    return flatStyle;
  }

  if (Array.isArray(styles)) {
    // We need to flatten in reverse order so that the last style in the array is the one defined
    for (let i = styles.length - 1; i >= 0; i--) {
      if (styles[i]) {
        flattenStyle(styles[i], options, flatStyle);
      }
    }
    return flatStyle;
  }

  // The is the metadata for the style object.
  // It contains information is like the MediaQuery data
  //
  // Note: This is different to flatStyleMeta, which is the metadata
  // for the FLATTENED style object
  const styleMeta = styleMetaMap.get(styles) || {};

  /*
   * TODO: Investigate if we early exit if there is no styleMeta.
   */

  /*
   * START OF CONDITIONS CHECK
   *
   * If any of these fail, this style and its metadata will be skipped
   */
  if (
    styleMeta.pseudoClasses &&
    !testPseudoClasses(options.interaction, styleMeta.pseudoClasses)
  ) {
    return flatStyle;
  }

  // Skip failed media queries
  if (styleMeta.media && !styleMeta.media.every((m) => testMediaQuery(m))) {
    return flatStyle;
  }

  if (!testContainerQuery(styleMeta.containerQuery, options.containers)) {
    return flatStyle;
  }
  /*
   * END OF CONDITIONS CHECK
   */

  if (styleMeta.animations) {
    flatStyleMeta.animations = {
      ...styleMeta.animations,
      ...flatStyleMeta.animations,
    };
  }

  if (styleMeta.transition) {
    flatStyleMeta.transition = {
      ...styleMeta.transition,
      ...flatStyleMeta.transition,
    };
  }

  if (styleMeta.container) {
    flatStyleMeta.container ??= { type: "normal", names: [] };

    if (styleMeta.container.names) {
      flatStyleMeta.container.names = styleMeta.container.names;
    }
    if (styleMeta.container.type) {
      flatStyleMeta.container.type = styleMeta.container.type;
    }
  }

  if (styleMeta.requiresLayout) {
    flatStyleMeta.requiresLayout = true;
  }

  if (styleMeta.variables) {
    flatStyleMeta.variables ??= {};
    for (const [key, value] of Object.entries(styleMeta.variables)) {
      // Skip already set variables
      if (key in flatStyleMeta.variables) continue;

      const getterOrValue = extractValue(
        value,
        flatStyle,
        flatStyleMeta,
        options
      );

      if (typeof getterOrValue === "function") {
        Object.defineProperty(flatStyleMeta.variables, key, {
          enumerable: true,
          get() {
            return getterOrValue();
          },
        });
      } else {
        flatStyleMeta.variables[key] = getterOrValue;
      }
    }
  }

  for (const [key, value] of Object.entries(styles)) {
    // Skip already set keys
    if (key in flatStyle) continue;

    if (key === "transform") {
      const transform = [];

      for (const transformObject of value) {
        for (const [transformKey, transformValue] of Object.entries(
          transformObject
        )) {
          const _transform: Record<string, any> = {};

          const getterOrValue = extractValue(
            transformValue,
            flatStyle,
            flatStyleMeta,
            options
          );

          if (typeof getterOrValue === "function") {
            Object.defineProperty(_transform, transformKey, {
              configurable: true,
              enumerable: true,
              get() {
                return getterOrValue();
              },
            });
          } else {
            _transform[transformKey] = getterOrValue;
          }

          transform.push(_transform);
        }
      }

      flatStyle.transform = transform as any;
    } else {
      const getterOrValue = extractValue(
        value,
        flatStyle,
        flatStyleMeta,
        options
      );

      if (typeof getterOrValue === "function") {
        Object.defineProperty(flatStyle, key, {
          configurable: true,
          enumerable: true,
          get() {
            return getterOrValue();
          },
        });
      } else {
        flatStyle[key as keyof Style] = getterOrValue;
      }
    }
  }

  return flatStyle;
}

/*
 * Most styles we can calculate immediately however styles that use CSS variables
 * can only be calculated once the style has been completely flattened
 * We use a getter to delay calculation until the value is actually needed
 */
function extractValue(
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  options: FlattenStyleOptions
): any {
  if (isRuntimeValue(value)) {
    switch (value.name) {
      case "vh":
        return round((vh.get() / 100) * (value.arguments[0] as number));
      case "vw":
        return round((vw.get() / 100) * (value.arguments[0] as number));
      case "rem":
        return round(rem.get() * (value.arguments[0] as number));
      case "em":
        return () => {
          const multiplier = value.arguments[0] as number;

          if ("fontSize" in flatStyle) {
            return round((flatStyle.fontSize || 0) * multiplier);
          }

          return undefined;
        };
      case "ch": {
        const multiplier = value.arguments[0] as number;

        let reference: number | undefined;

        if (options.ch) {
          reference = options.ch;
        } else if (options.interaction?.layout.height.get()) {
          reference = options.interaction.layout.height.get();
        } else if (typeof flatStyle.height === "number") {
          reference = flatStyle.height;
        }

        if (reference) {
          return round(reference * multiplier);
        } else {
          return () => {
            if (options.interaction?.layout.height.get()) {
              reference = options.interaction.layout.height.get();
            } else if (typeof flatStyle.height === "number") {
              reference = flatStyle.height;
            } else {
              reference = 0;
            }

            return round(reference * multiplier);
          };
        }
      }
      case "cw": {
        const multiplier = value.arguments[0] as number;

        let reference: number | undefined;

        if (options.cw) {
          reference = options.cw;
        } else if (options.interaction.layout.width.get()) {
          reference = options.interaction.layout.width.get();
        } else if (typeof flatStyle.width === "number") {
          reference = flatStyle.width;
        }

        if (reference) {
          return round(reference * multiplier);
        } else {
          return () => {
            if (options.interaction.layout.width.get()) {
              reference = options.interaction.layout.width.get();
            } else if (typeof flatStyle.width === "number") {
              reference = flatStyle.width;
            } else {
              reference = 0;
            }

            return round(reference * multiplier);
          };
        }
      }
      case "var":
        return () => {
          const name = value.arguments[0] as string;
          const resolvedValue =
            flatStyleMeta.variables?.[name] ?? options.variables[name];
          return typeof resolvedValue === "function"
            ? resolvedValue()
            : resolvedValue;
        };
      default: {
        let isStatic = true;
        const args: unknown[] = [];

        for (const arg of value.arguments) {
          const getterOrValue = extractValue(
            arg,
            flatStyle,
            flatStyleMeta,
            options
          );

          if (typeof getterOrValue === "function") {
            isStatic = false;
          }

          args.push(getterOrValue);
        }

        if (isStatic) {
          return `${value.name}(${args.join(", ")})`;
        } else {
          return () => {
            const _args = args.map((a) => (typeof a === "function" ? a() : a));
            return `${value.name}(${_args.join(", ")})`;
          };
        }
      }
    }
  }

  return value;
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}
