import React from "react";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BouncingLink } from "../etc/BouncingLink";
import { transition } from "../etc/transition";

export default function Page() {
  return (
    <Animated.ScrollView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
      contentContainerStyle={{
        paddingTop: 128,
        paddingBottom: useSafeAreaInsets().bottom,
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-around",
        rowGap: 24,
      }}
    >
      {new Array(12).fill("0").map((v, i) => (
        <BouncingLink href={"/next?i=" + i}>
          <Animated.Image
            sharedTransitionStyle={transition}
            sharedTransitionTag={"img-" + i}
            source={require("../assets/poster.jpg")}
            resizeMode="cover"
            style={{
              height: 250,
              // width: "45%",
              aspectRatio: "2/3",
              borderRadius: 48,
              overflow: "hidden",
            }}
          />
        </BouncingLink>
      ))}
    </Animated.ScrollView>
  );
}
