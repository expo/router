import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ErrorBoundaryProps } from 'expo-router';
import { Text, View } from 'react-native';

export const getNavOptions = (): NativeStackNavigationOptions => ({
    presentation: "modal",
});

export function ErrorBoundary(props: ErrorBoundaryProps) {
    return (
        <View style={{ flex: 1, backgroundColor: "red" }}>
            <Text>{props.error.message}</Text>
            <Text onPress={props.retry}>Try Again?</Text>
        </View>
    );
}

export default function App() {
    if (Math.random() > 0.5) {
        throw new Error("lol: " + __filename);
    }
    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "dodgerblue",
                padding: 24,
                alignItems: "center",
                justifyContent: 'center'
            }}
        >
            <Text
                onPress={() => {
                }}
            >
                Reload the page until an error is thrown, this tests the component-level error boundary.
            </Text>
        </View>
    );
}
