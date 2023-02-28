import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function Page() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "The Batman" }} />
      <Animated.View
        sharedTransitionTag="img"
        style={{
          width: "100%",
          aspectRatio: "2/3",
          borderRadius: 1,
          overflow: "hidden",
          borderCurve: "continuous",
        }}
      >
        <Image
          source={require("../assets/poster.jpg")}
          style={[
            StyleSheet.absoluteFill,
            {
              flex: 1,
              width: "100%",
              height: "100%",
            },
          ]}
        />
        <LinearGradient
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
          }}
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,1)"]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
    backgroundColor: "dodgerblue",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
