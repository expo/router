import { Link } from 'expo-router';
import { View, Text } from 'react-native';

// Learn more: TODO
export default function App() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Link href="/sign-up">Sign up</Link>
            <Text style={{ fontSize: 36 }}>{__filename}</Text>
        </View>
    );
}