import { Text, View } from "@bacons/react-views";
import React from "react";
import { ActivityIndicator, Animated } from "react-native";

import { RouteNode, useRouteNode } from "./Route";

function useFadeIn() {
  // Returns a React Native Animated value for fading in
  const [value] = React.useState(() => new Animated.Value(0));
  React.useEffect(() => {
    Animated.timing(value, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  return value;
}

export function MissingRoute() {
  const route = useRouteNode();
  const value = useFadeIn();
  return (
    <Animated.View
      style={{
        opacity: value,
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 24 }}>
        No <Text style={{ color: "#E37DBB" }}>default export</Text> from route{" "}
        <Text style={{ color: "#F3F99A" }}>{route?.contextKey}</Text>
      </Text>
    </Animated.View>
  );
}

export function LoadingRoute({ route }: { route: RouteNode }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "black", fontSize: 24 }}>
        Bundling <Text style={{ fontWeight: "bold" }}>{route?.contextKey}</Text>
      </Text>
      <ActivityIndicator />
    </View>
  );
}
