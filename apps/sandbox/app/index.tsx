import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function Page() {
  return (
    <View style={styles.container}>
      <Link asChild href="/next">
        <Pressable>
          <Animated.View
            sharedTransitionTag="img"
            style={{
              width: "45%",
              aspectRatio: "2/3",
              borderRadius: 48,
              overflow: "hidden",
              borderCurve: "continuous",
            }}
          >
            <Image
              source={require("../assets/poster.jpg")}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bottom: 0,
                right: 0,

                flex: 1,
              }}
            />
          </Animated.View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
    backgroundColor: "green",
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
