import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ErrorBoundaryProps } from 'expo-router';
import { Text, View } from 'react-native';

export const getNavOptions = (): NativeStackNavigationOptions => ({
    presentation: "modal",
    animation: 'default'
});


export function ErrorBoundary(props: ErrorBoundaryProps) {
    return (
        <View style={{ flex: 1, backgroundColor: "red" }}>
            <Text>{props.error.message}</Text>
            <Text onPress={props.retry}>Try Again?</Text>
        </View>
    );
}


export default function App({ navigation }) {
    if (Math.random() > 0.5) {
        throw new Error("lol: " + __filename);
    }

    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "crimson",
                padding: 24,
                alignItems: "stretch",
            }}
        >
            <Text
                style={{ position: "absolute", top: 8, left: 8 }}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                {__filename}
            </Text>
        </View>
    );
}
