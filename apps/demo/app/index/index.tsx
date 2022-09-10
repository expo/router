// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { useNavigator } from 'expo-router';
// import { useWindowDimensions } from 'react-native';

// const Nav = createDrawerNavigator();

// export default function App() {

//     const isLong = useWindowDimensions().width >= 1080;

//     const Navigator = useNavigator(Nav)
//     return (
//         <Navigator screenOptions={{
//             drawerType: isLong ? "permanent" : "front",
//         }} />
//     );
// }

import { Text, View } from 'react-native';

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
