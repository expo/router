import { RuntimeValue } from "../../types";

export function isRuntimeValue(value: unknown): value is RuntimeValue {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "runtime"
  );
}
