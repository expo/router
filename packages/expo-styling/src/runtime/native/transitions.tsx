import { useRef } from "react";
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { styleMetaMap } from "./globals";
import { cssTimeToNumber } from "./utils";
import { Style } from "../../types";

export function useTransitions(style: Style) {
  const transition = styleMetaMap.get(style)?.transition;
  const previous = useRef<Record<string, any>>({ ...style });

  const dependencies: any[] = [];
  const animationTuples: any[] = [];
  const properties = transition?.property || [];

  for (let index = 0; index < properties.length; index++) {
    const prop = properties[index];
    const duration = transition?.duration?.[
      index % (transition?.duration.length || 0)
    ] || { type: "milliseconds", value: 0 };

    switch (prop) {
      // case "transform":
      // case "translate":
      // case "rotate":
      // case "scale":
      case "order":
        continue;
      case "borderBottomLeftRadius":
      case "borderBottomRightRadius":
      case "borderBottomWidth":
      case "borderLeftWidth":
      case "borderRadius":
      case "borderRightWidth":
      case "borderTopWidth":
      case "borderWidth":
      case "bottom":
      case "flex":
      case "flexBasis":
      case "flexGrow":
      case "flexShrink":
      case "fontSize":
      case "fontWeight":
      case "gap":
      case "height":
      case "left":
      case "letterSpacing":
      case "lineHeight":
      case "margin":
      case "marginBottom":
      case "marginLeft":
      case "marginRight":
      case "marginTop":
      case "maxHeight":
      case "maxWidth":
      case "minHeight":
      case "minWidth":
      case "objectPosition":
      case "opacity":
      case "padding":
      case "paddingBottom":
      case "paddingLeft":
      case "paddingRight":
      case "paddingTop":
      case "right":
      case "textDecoration":
      case "top":
      case "transformOrigin":
      case "verticalAlign":
      case "visibility":
      case "width":
      case "wordSpacing":
      case "zIndex": {
        /* eslint-disable react-hooks/rules-of-hooks */
        const $style = style as Record<string, number>;
        const from = previous.current[prop];
        const to = $style[prop];
        const progress = useSharedValue<number>(to);

        if (from !== to) {
          progress.value = from;
          progress.value = withTiming(to, {
            duration: cssTimeToNumber(duration),
          });
          previous.current[prop] = to;
        }
        dependencies.push(progress);
        animationTuples.push([prop, (value: number) => value]);
        /* eslint-enable react-hooks/rules-of-hooks */
        break;
      }
      case "backgroundColor":
      case "borderBottomColor":
      case "borderLeftColor":
      case "borderRightColor":
      case "borderTopColor":
      case "color": {
        /* eslint-disable react-hooks/rules-of-hooks */
        const $style = style as Record<string, string>;
        const value = $style[prop];
        const progress = useSharedValue<number>(0);
        const ref = useRef<[string, string]>([value, value]);

        if (ref.current[0] !== value) {
          progress.value = 0;
          progress.value = withTiming(1, {
            duration: cssTimeToNumber(duration),
          });
          ref.current = [ref.current[1], value];
        }
        dependencies.push(progress);
        animationTuples.push([
          prop,
          (value: number) => interpolateColor(value, [0, 1], ref.current),
        ]);
        /* eslint-enable react-hooks/rules-of-hooks */
        break;
      }
    }
  }
  return useAnimatedStyle(() => {
    const style: Record<string, unknown> = {};
    for (const [index, [prop, transform]] of animationTuples.entries()) {
      style[prop] = transform(dependencies[index].value);
    }
    return style;
  }, dependencies);
}
