import { View, Text } from 'react-native';
import { ContextContainer, Link } from 'expo-router';
import { DefaultTheme, useNavigation } from '@react-navigation/native';

// Learn more: TODO
export default function App() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <ContextContainer theme={DefaultTheme} />
            <Text style={{ fontSize: 36 }}>{__filename}</Text>
        </View>
    );
}