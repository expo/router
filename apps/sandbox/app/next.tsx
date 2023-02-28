import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter, useSearchParams } from "expo-router";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { transition } from "../etc/transition";

export default function Page() {
  const { i } = useSearchParams();
  const router = useRouter();
  const goNext = () => router.back();

  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };
  type AnimatedGHContext = {
    startX: number;
    startY: number;
  };
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_, ctx) => {
      ctx.startX = translation.x.value;
      ctx.startY = translation.y.value;
    },
    onActive: (event, ctx) => {
      translation.x.value = ctx.startX + event.translationX;
      translation.y.value = ctx.startY + event.translationY;
    },
    onEnd: (_) => {
      if (Math.abs(translation.x.value) + Math.abs(translation.y.value) > 150) {
        runOnJS(goNext)();
      }
      translation.x.value = withSpring(0);
      translation.y.value = withSpring(0);
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translation.x.value },
        { translateY: translation.y.value },
        {
          scale: Math.max(
            0.5,
            1 -
              (Math.abs(translation.x.value) + Math.abs(translation.y.value)) /
                500
          ),
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <Stack.Screen options={{ title: "The Batman" }} />

        <Animated.Image
          sharedTransitionTag={"img-" + i}
          sharedTransitionStyle={transition}
          source={require("../assets/poster.jpg")}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 1,
            overflow: "hidden",
            // borderCurve: "continuous",
          }}
        />
        <LinearGradient
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
          }}
          locations={[0, 0.5]}
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,1)"]}
        />
      </Animated.View>
    </PanGestureHandler>
  );
}
