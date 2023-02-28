import Animated, {
  SharedTransition,
  withSpring,
} from "react-native-reanimated";

export const transition = SharedTransition.custom((values) => {
  "worklet";
  return {
    width: withSpring(values.targetWidth),
    height: withSpring(values.targetHeight),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});
