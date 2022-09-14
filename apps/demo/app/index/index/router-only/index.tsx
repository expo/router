import { View, Text } from "react-native";

export default function App() {
    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "blue",
                padding: 24,
                alignItems: "stretch",
            }}
        >
            <Text style={{ position: 'absolute', top: 8, left: 8 }}>{__filename}</Text>

        </View>
    );
}
