import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ErrorBoundaryProps } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

export const getNavOptions = (): NativeStackNavigationOptions => ({
    presentation: "modal",
});

export function ErrorBoundary(props: ErrorBoundaryProps) {
    return (
        <View style={{
            margin: 24,
            borderRadius: 20,
            flex: 1,
            backgroundColor: "firebrick",
            padding: 24,
            alignItems: "center",
            justifyContent: 'center'
        }}>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 24 }}>Error Boundary</Text>
            <Text style={{ marginVertical: 8, }}>Message: {props.error.message}</Text>
            <Text onPress={props.retry}>Try Again?</Text>
        </View>
    );
}
export default function App() {
    const [v, setV] = useState(1);

    if (v % 2 === 0) {
        throw new Error("Controlled error from: " + __filename);
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
                style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}
                onPress={() => {
                    setV(v + 1);
                }}
            >
                Throw a component-level error
            </Text>
        </View>
    );
}
