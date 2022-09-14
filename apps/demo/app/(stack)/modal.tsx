import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

export const getNavOptions = (): NativeStackNavigationOptions => ({
    presentation: "modal",
});

export default function App({ navigation }) {
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
