import { SignalLike } from "../../types";

export function unwrap<T>(value: T | SignalLike<T>): T {
  return value && typeof value === "object" && "get" in value
    ? value.get()
    : value;
}

export function kebabToCamelCase(str: string) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
