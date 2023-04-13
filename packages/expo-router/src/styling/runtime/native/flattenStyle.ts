import { rem, vh, vw } from "./globals";
import { runtimeStyleProps, variables } from "./symbols";
import { Style } from "../../types";
import { isRuntimeValue } from "./guards";

export function flattenStyle(
  style: Style | Style[] | undefined | null,
  flatStyle?: Style
): Style {
  flatStyle ??= { [runtimeStyleProps]: new Set(), [variables]: {} };

  if (Array.isArray(style)) {
    // We need to flatten in reverse order so that the last style in the array
    // is the value set
    for (let i = style.length - 1; i >= 0; i--) {
      flatStyle = flattenStyle(style[i], flatStyle);
    }
    return flatStyle;
  } else if (!style) {
    return flatStyle;
  }

  for (const [key, value] of Object.entries(style)) {
    // Variables are prefixed with `--` and should not be flattened
    if (key.startsWith("--") && flatStyle[variables]) {
      // Skip already set variables
      if (key in flatStyle[variables]) continue;

      const getterOrValue = extractValue(value, flatStyle);

      if (typeof getterOrValue === "function") {
        Object.defineProperty(flatStyle[variables], key, {
          enumerable: true,
          get() {
            return getterOrValue();
          },
        });
      } else {
        flatStyle[variables][key] = getterOrValue;
      }
    } else {
      // Skip already set keys
      if (key in flatStyle) continue;
      // Non runtime styles can be set directly
      if (!style[runtimeStyleProps]?.has(key)) {
        flatStyle[key as keyof Style] = value;
        continue;
      }

      const getterOrValue = extractValue(value, flatStyle);

      if (typeof getterOrValue === "function") {
        Object.defineProperty(flatStyle, key, {
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
function extractValue(value: unknown, flatStyle: Style): any {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  } else if (isRuntimeValue(value)) {
    switch (value.name) {
      case "vh":
        return (vh.get() / 100) * (value.arguments[0] as number);
      case "vw":
        return (vw.get() / 100) * (value.arguments[0] as number);
      case "rem":
        return rem.get() * (value.arguments[0] as number);
      case "var":
        return () => {
          const resolvedValue =
            flatStyle[variables]![value.arguments[0] as string];
          return typeof resolvedValue === "function"
            ? resolvedValue()
            : resolvedValue;
        };
      default: {
        let isStatic = true;
        const args: unknown[] = [];

        for (const arg of value.arguments) {
          const getterOrValue = extractValue(arg, flatStyle);

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
}
