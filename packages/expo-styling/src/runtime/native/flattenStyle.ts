import { rem, styleMetaMap, vh, vw } from "./globals";
import { isRuntimeValue } from "./guards";
import { testMediaQuery } from "./mediaQuery";
import { Style, StyleMeta, StyleProp } from "../../types";

/**
 * Reduce a StyleProp to a flat Style object.
 * As we loop over keys & values, we will resolve any dynamic values.
 * Some values cannot be calculated until the entire style has been flattened.
 * These values are defined as a getter and will be resolved lazily
 */
export function flattenStyle(styles: StyleProp, flatStyle?: Style): Style {
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
        flattenStyle(styles[i], flatStyle);
      }
    }
    return flatStyle;
  }

  // The is the metadata for the style object.
  // It contains information is like the MediaQuery data
  //
  // Note: This is different to flatStyleMeta, which is the metadata
  // for the FLATTENED style object
  const styleMeta = styleMetaMap.get(styles) ?? {};

  for (const [key, value] of Object.entries(styles)) {
    // Variables are prefixed with `--` and should not be flattened
    if (key.startsWith("--")) {
      flatStyleMeta.variables ??= {};

      // Skip already set variables
      if (key in flatStyleMeta.variables) continue;

      const getterOrValue = extractValue(value, flatStyle, flatStyleMeta);

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
      continue;
    }

    // Skip already set keys
    if (key in flatStyle) continue;

    // Skip failed media queries
    if (styleMeta.media && !styleMeta.media.every(testMediaQuery)) {
      continue;
    }

    const getterOrValue = extractValue(value, flatStyle, flatStyleMeta);

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
  flatStyleMeta: StyleMeta
): any {
  if (isRuntimeValue(value)) {
    switch (value.name) {
      case "vh":
        return (vh.get() / 100) * (value.arguments[0] as number);
      case "vw":
        return (vw.get() / 100) * (value.arguments[0] as number);
      case "rem":
        return rem.get() * (value.arguments[0] as number);
      case "em":
        return () => {
          const multiplier = value.arguments[0] as number;

          if ("fontSize" in flatStyle) {
            return (flatStyle.fontSize || 0) * multiplier;
          }

          return undefined;
        };
      case "var":
        return () => {
          const resolvedValue =
            flatStyleMeta.variables?.[value.arguments[0] as string];
          return typeof resolvedValue === "function"
            ? resolvedValue()
            : resolvedValue;
        };
      default: {
        let isStatic = true;
        const args: unknown[] = [];

        for (const arg of value.arguments) {
          const getterOrValue = extractValue(arg, flatStyle, flatStyleMeta);

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
