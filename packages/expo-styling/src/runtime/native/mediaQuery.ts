import {
  MediaCondition,
  MediaFeature,
  MediaFeatureValue,
  MediaQuery,
} from "lightningcss";

import { colorScheme, vh, vw } from "./globals";
import { exhaustiveCheck } from "../../css-to-rn/utils";

/**
 * Test a media query against current conditions
 */
export function testMediaQuery(mediaQuery: MediaQuery) {
  const conditionsPass = testCondition(mediaQuery.condition);
  return mediaQuery.qualifier === "not" ? !conditionsPass : conditionsPass;
}

function testCondition(condition?: MediaCondition | null): boolean {
  if (!condition) return true;

  if (condition.type === "operation") {
    if (condition.operator === "and") {
      return condition.conditions.every(testCondition);
    } else {
      return condition.conditions.some(testCondition);
    }
  } else if (condition.type === "not") {
    return !testCondition(condition.value);
  }

  return testFeature(condition.value);
}

function testFeature(feature: MediaFeature) {
  switch (feature.type) {
    case "plain":
      return testPlainFeature(feature.name, feature.value);
    case "range":
    case "boolean":
    case "interval":
      return false;
    default:
      exhaustiveCheck(feature);
  }

  return false;
}

function testPlainFeature(name: string, featureValue: MediaFeatureValue) {
  const value = getMediaFeatureValue(featureValue);

  if (value === null) {
    return false;
  }

  switch (name) {
    case "prefers-color-scheme":
      return colorScheme.get() === value;
    case "width":
      return vw.get() === value;
    case "min-width":
      return vw.get() >= value;
    case "max-width":
      return vw.get() <= value;
    case "height":
      return vh.get() === value;
    case "min-height":
      return vh.get() >= value;
    case "max-height":
      return vh.get() <= value;
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
