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
            <Link style={{ fontSize: 36 }} href="/___index">{__filename}</Link>
        </View>
    );
}