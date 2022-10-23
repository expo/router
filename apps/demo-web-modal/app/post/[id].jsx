import { View, Text, TouchableOpacity } from "react-native";

/** modal */
export default function Page({ navigation, route }) {
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onPress={() => navigation.goBack()}
    >
      <View
        style={{
          width: 300,
          height: 600,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>given id:</Text>
        <Text>{route.params.id}</Text>
      </View>
    </TouchableOpacity>
  );
}
