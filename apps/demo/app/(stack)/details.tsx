import { View, Text } from "react-native";
import { ScreenOptions } from 'expo-router';

export const getNavOptions = ({ route }) => ({
    // NOTE(EvanBacon): Prefer doing this in the component with `useLayoutEffect`.
    title: route?.params?.name,
});

export default function Details({ navigation, route }) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {/* NOTE(EvanBacon): Preferred way to use route to update navigation options. */}
            <ScreenOptions title={route?.params?.name} />
            <Text
                onPress={() => {
                    navigation.setParams({ name: 'Updated' })
                }}
            >
                Update the title
            </Text>
        </View>
    );
}