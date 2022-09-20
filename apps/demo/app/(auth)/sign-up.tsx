import { View, Text } from 'react-native';


export { ErrorBoundary } from 'expo-router';

// Learn more: TODO
export default function App() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <a href="/sign-in">sign in</a>
            <Text style={{ fontSize: 36 }}>{__filename}</Text>
        </View>
    );
}