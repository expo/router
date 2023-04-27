import { AnimationIterationCount, EasingFunction, Time } from "lightningcss";
import React from "react";
import { Easing } from "react-native-reanimated";

import { exhaustiveCheck } from "../../css-to-rn/utils";
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

export function cssTimeToNumber(time: Time) {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
}

export function cssCountToNumber(count: AnimationIterationCount) {
  return count.type === "infinite" ? Infinity : count.value;
}

export function cssTimingFunctionToEasing(timingFunction: EasingFunction) {
  switch (timingFunction.type) {
    case "linear":
    case "ease":
    case "ease-in":
    case "ease-out":
    case "ease-in-out":
      return Easing.linear;
    case "cubic-bezier":
      return Easing.bezier(
        timingFunction.x1,
        timingFunction.y1,
        timingFunction.x2,
        timingFunction.y2
      );
    case "steps":
      throw new Error("Not supported");
    default:
      exhaustiveCheck(timingFunction);
      throw new Error("Unknown timing function");
  }
}
