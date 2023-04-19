import React from "react";

import { RuntimeValue, SignalLike } from "../../types";

export function unwrap<T>(value: T | SignalLike<T>): T {
  return value && typeof value === "object" && "get" in value
    ? value.get()
    : value;
}

export function kebabToCamelCase(str: string) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}

export function isRuntimeValue(value: unknown): value is RuntimeValue {
  if (!value) {
    return false;
  } else if (Array.isArray(value)) {
    return value.some((v) => isRuntimeValue(v));
  } else if (typeof value === "object") {
    if ("type" in value && value.type === "runtime") {
      return true;
    } else {
      return Object.values(value).some((v) => isRuntimeValue(v));
    }
  } else {
    return false;
  }
}

function useDynamicDependancies(value: React.DependencyList) {
  const ref = React.useRef<React.DependencyList>([]);

  if (
    value.length !== ref.current.length ||
    !ref.current.every((v, i) => Object.is(v, value[i]))
  ) {
    ref.current = value;
  }

  return ref.current;
}

export function useDynamicMemo<T>(
  factory: () => T,
  value: React.DependencyList
) {
  return React.useMemo(factory, [useDynamicDependancies(value)]);
}
