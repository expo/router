import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Exception } from 'expo-router';
import { Text, View } from '@bacons/react-views';

export const getNavOptions = (): NativeStackNavigationOptions => ({

});

export const ErrorBoundary = Exception;

export default function App({ navigation }) {

    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "darkturquoise",
                padding: 24,

            }}
            center
        >
            <Text
                style={{ position: "absolute", top: 8, left: 8 }}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                {__filename}
            </Text>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 36 }}>Profile</Text>
        </View>
    );
}
