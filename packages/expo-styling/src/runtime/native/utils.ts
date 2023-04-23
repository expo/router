import { SignalLike } from "../../types";

export function unwrap<T>(value: T | SignalLike<T>): T {
  return value && typeof value === "object" && "get" in value
    ? value.get()
    : value;
}
