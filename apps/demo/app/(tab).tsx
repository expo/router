import { Children } from "expo-router";
import { View } from "react-native";

export default function Layout() {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 64, backgroundColor: 'blue' }} />
            <Children />
        </View>
    );
}
