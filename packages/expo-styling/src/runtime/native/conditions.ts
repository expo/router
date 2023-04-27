import {
  MediaCondition,
  MediaFeature,
  MediaFeatureValue,
  MediaQuery,
} from "lightningcss";

import { exhaustiveCheck } from "../../css-to-rn/utils";
import {
  Interaction,
  PseudoClassesQuery,
  SignalLike,
} from "../../types";
import { colorScheme, isReduceMotionEnabled, vh, vw } from "./globals";
import { unwrap } from "./utils";

interface ConditionReference {
  width: number | SignalLike<number>;
  height: number | SignalLike<number>;
}

const defaultConditionReference: ConditionReference = {
  width: vw,
  height: vh,
};

/**
 * Test a media query against current conditions
 */
export function testMediaQuery(
  mediaQuery: MediaQuery,
  conditionReference: ConditionReference = defaultConditionReference
) {
  const conditionsPass = testCondition(
    mediaQuery.condition,
    conditionReference
  );
  return mediaQuery.qualifier === "not" ? !conditionsPass : conditionsPass;
}

export function testPseudoClasses(
  interaction: Interaction,
  meta: PseudoClassesQuery
) {
  if (meta.active && !interaction.active.get()) {
    return false;
  }

  if (meta.hover && !interaction.hover.get()) {
    return false;
  }

  if (meta.focus && !interaction.focus.get()) {
    return false;
  }

  return true;
}

/**
 * Test a media condition against current conditions
 * This is also used for container queries
 */
export function testCondition(
  condition: MediaCondition | null | undefined,
  conditionReference: ConditionReference
): boolean {
  if (!condition) return true;

  if (condition.type === "operation") {
    if (condition.operator === "and") {
      return condition.conditions.every((c) =>
        testCondition(c, conditionReference)
      );
    } else {
      return condition.conditions.some((c) =>
        testCondition(c, conditionReference)
      );
    }
  } else if (condition.type === "not") {
    return !testCondition(condition.value, conditionReference);
  }

  return testFeature(condition.value, conditionReference);
}

function testFeature(
  feature: MediaFeature,
  conditionReference: ConditionReference
) {
  switch (feature.type) {
    case "plain":
      return testPlainFeature(feature, conditionReference);
    case "range":
      return testRange(feature, conditionReference);
    case "boolean":
      return testBoolean(feature);
    case "interval":
      return false;
    default:
      exhaustiveCheck(feature);
  }

  return false;
}

function testPlainFeature(
  feature: Extract<MediaFeature, { type: "plain" }>,
  ref: ConditionReference
) {
  const value = getMediaFeatureValue(feature.value);

  if (value === null) {
    return false;
  }

  switch (feature.name) {
    case "prefers-color-scheme":
      return colorScheme.get() === value;
    case "width":
      return typeof value === "number" && unwrap(ref.width) === value;
    case "min-width":
      return typeof value === "number" && unwrap(ref.width) >= value;
    case "max-width":
      return typeof value === "number" && unwrap(ref.width) <= value;
    case "height":
      return typeof value === "number" && unwrap(ref.height) === value;
    case "min-height":
      return typeof value === "number" && unwrap(ref.height) >= value;
    case "max-height":
      return typeof value === "number" && unwrap(ref.height) <= value;
    default:
      return false;
  }
}

function getMediaFeatureValue(value: MediaFeatureValue) {
  if (value.type === "number") {
    return value.value;
  } else if (value.type === "length") {
    if (value.value.type === "value") {
      if (value.value.value.unit === "px") {
        return value.value.value.value;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else if (value.type === "ident") {
    return value.value;
  }

  return null;
}

function testRange(
  feature: Extract<MediaFeature, { type: "range" }>,
  ref: ConditionReference
) {
  const value = getMediaFeatureValue(feature.value);

  if (value === null || typeof value !== "number") {
    return false;
  }

  /*eslint no-fallthrough: ["error", { "commentPattern": "break[\\s\\w]*omitted" }]*/
  switch (feature.name) {
    case "height": {
      switch (feature.operator) {
        case "equal":
          return value === unwrap(ref.height);
        case "greater-than":
          return unwrap(ref.height) > value;
        case "greater-than-equal":
          return unwrap(ref.height) >= value;
        case "less-than":
          return unwrap(ref.height) < value;
        case "less-than-equal":
          return unwrap(ref.height) <= value;
      }
      // break omitted - unreachable code
    }
    case "width":
      switch (feature.operator) {
        case "equal":
          return value === unwrap(ref.width);
        case "greater-than":
          return unwrap(ref.width) > value;
        case "greater-than-equal":
          return unwrap(ref.width) >= value;
        case "less-than":
          return unwrap(ref.width) < value;
        case "less-than-equal":
          return unwrap(ref.width) >= value;
      }
  }

  return false;
}

function testBoolean(feature: Extract<MediaFeature, { type: "boolean" }>) {
  switch (feature.name) {
    case "prefers-reduced-motion":
      return isReduceMotionEnabled.get();
  }
  return false;
}
