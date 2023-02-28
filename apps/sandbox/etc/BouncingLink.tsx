import { Link } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BouncingLink({
  scale = 0.9,
  children,
  ...props
}: React.ComponentProps<typeof Link> &
  React.ClassAttributes<typeof Link> & { scale?: number }) {
  const animatedScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedScale.value }],
    };
  });

  return (
    <Link asChild {...props}>
      <AnimatedPressable
        style={animatedStyle}
        onPressIn={() => {
          animatedScale.value = withSpring(scale);
        }}
        onPressOut={() => {
          animatedScale.value = withSpring(1);
        }}
      >
        {children}
      </AnimatedPressable>
    </Link>
  );
}
