import { StackNavigator, useSelectedRoute } from "expo-router";
import { Platform, View } from "react-native";
export default function App() {
    if (Platform.OS === 'web') {
        const children = useSelectedRoute()
        return (<View style={{ flex: 1 }}>
            <View style={{ zIndex: 650, position: 'absolute', top: 0, left: 0, right: 0, height: 64, backgroundColor: 'blue' }}>

            </View>
            {children}
        </View>);
    }
    return (<StackNavigator screenOptions={{}} />)
};
