import { View, Text } from 'react-native';

// Learn more: TODO
export default function App({ post }) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text style={{ fontSize: 36 }}>{__filename}</Text>
            <Text style={{ fontSize: 36 }}>Post: {post}</Text>
        </View>
    );
}