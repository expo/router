import { ComponentType, useEffect } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { FlattenStyleOptions } from "./flattenStyle";
import { animationMap, styleMetaMap } from "./globals";
import {
  cssCountToNumber,
  cssTimeToNumber,
  cssTimingFunctionToEasing,
} from "./utils";
import { ExtractedAnimations, Style, TransformRecord } from "../../types";

export interface AnimationStylesWrapperProps {
  component: ComponentType<any>;
}

export function useAnimations(style: Style, options: FlattenStyleOptions) {
  const styleMetadata = styleMetaMap.get(style);

  if (!styleMetadata?.animations?.name) {
    return;
  }

  const $style = { ...style };

  /* eslint-disable react-hooks/rules-of-hooks */
  for (let index = 0; index < styleMetadata?.animations?.name.length; index++) {
    Object.assign(
      $style,
      useAnimation(styleMetadata.animations, index, options)
    );
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  return $style;
}

function useAnimation(
  animations: ExtractedAnimations,
  index: number,
  _options: FlattenStyleOptions
) {
  const animationName = getAnimationValue(animations.name, index, {
    type: "none",
  });

  const name = animationName.type === "none" ? "none" : animationName.value;

  const direction = getAnimationValue(animations.direction, index, "normal");
  const duration = cssTimeToNumber(
    getAnimationValue(animations.duration, index, { type: "seconds", value: 0 })
  );
  const timingFunction = cssTimingFunctionToEasing(
    getAnimationValue(animations.timingFunction, index, { type: "linear" })
  );
  const iterationCount = cssCountToNumber(
    getAnimationValue(animations.iterationCount, index, {
      type: "number",
      value: 1,
    })
  );

  const fillMode = getAnimationValue(animations.fillMode, index, "none");

  // This keeps track of the progress across all frames
  const animatedFrameIndex = useSharedValue(0);

  const keyframes = animationMap.get(name) ?? [];

  useEffect(() => {
    // Restart the animation anytime any of the animation's properties change
    // Or the component is remounted
    animatedFrameIndex.value = 0;

    const timingFrames: number[] = [];
    for (let index = 0; index < keyframes.length - 1; index++) {
      const from = keyframes[index];
      const to = keyframes[index + 1];

      timingFrames.push(
        withTiming(index + 1, {
          duration: duration * ((to.selector - from.selector) / 100),
          easing: timingFunction,
        })
      );
    }

    switch (direction) {
      case "normal":
        break;
      case "reverse":
        timingFrames.reverse();
        break;
      case "alternate":
      case "alternate-reverse":
        // TODO
        break;
    }

    switch (fillMode) {
      case "none":
        // Immedately loop back to the first frame
        // timingFrames.push(withTiming(0, { duration: 0 }));
        break;
      case "backwards":
      case "forwards":
      case "both":
        // TODO
        break;
    }

    const [firstFrame, ...sequence] = timingFrames;

    animatedFrameIndex.value = withRepeat(
      withSequence(firstFrame, ...sequence),
      iterationCount
    );
  }, [keyframes, duration, timingFunction, iterationCount]);

  return useAnimatedStyle(() => {
    const frameProgress = animatedFrameIndex.value % 1;

    const from = Math.floor(animatedFrameIndex.value);
    const to = from + 1;

    if (from >= keyframes.length - 1) {
      return keyframes[from].style;
    }

    const fromStyles = keyframes[from].style;
    const toStyles = keyframes[to].style;

    const style: Record<string, unknown> = {};

    for (const [key, toValue] of Object.entries(toStyles)) {
      let fromValue = fromStyles[key];

      // If the current key is not in the from styles, try to find it in the previous styles
      if (fromValue === undefined) {
        for (let index = from; index > 0; index--) {
          if (fromStyles[key]) {
            fromValue = fromStyles[key];
            break;
          }
        }
      }

      if (key === "transform") {
        const fromTransform = fromValue as Record<string, unknown>;
        const toTransform = toValue as Record<string, unknown>;

        style[key] = transformKeys
          .filter((key) => {
            return key in fromTransform || key in toTransform;
          })
          .map((key) => {
            return {
              [key]: interpolateWithUnits(
                frameProgress,
                fromTransform[key],
                toTransform[key]
              ),
            };
          });
      } else {
        style[key] = interpolateWithUnits(frameProgress, fromValue, toValue);
      }
    }

    return style;
  }, [animatedFrameIndex]);
}

function interpolateWithUnits(
  progress: number,
  from: unknown = 0,
  to: unknown = 0
) {
  if (typeof from === "number" && typeof to === "number") {
    return interpolate(progress, [0, 1], [from, to]);
  } else if (
    (typeof from === "string" && typeof to === "string") ||
    (typeof from === "string" && to === 0)
  ) {
    const unit = from.match(/[a-z%]+$/)?.[0];

    if (unit) {
      return `${interpolate(
        progress,
        [0, 1],
        [Number.parseFloat(from), Number.parseFloat(to.toString())]
      )}${unit}`;
    }
  } else if (typeof to === "string" && from === 0) {
    const unit = to.match(/[a-z%]+$/)?.[0];

    if (unit) {
      return `${interpolate(
        progress,
        [0, 1],
        [from, Number.parseFloat(to)]
      )}${unit}`;
    }
  }

  return 0;
}

const transformKeys = Object.keys({
  perspective: 1,
  translateX: 1,
  translateY: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 1,
  rotateX: 1,
  rotateY: 1,
  rotateZ: 1,
  skewX: 1,
  skewY: 1,
  scale: 1,
} satisfies Record<Exclude<keyof TransformRecord, "matrix">, 1>);

function getAnimationValue<T>(
  array: T[] | undefined,
  index: number,
  defaultValue: T
) {
  if (!array) return defaultValue;
  return array[index % array.length];
}
