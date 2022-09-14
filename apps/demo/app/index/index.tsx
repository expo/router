// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { useNavigator } from 'expo-router';
// import { useWindowDimensions } from 'react-native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { DrawerNavigator } from 'expo-router';
import { Text, useWindowDimensions, View } from 'react-native';

import { TabBarIcon } from '../../components/TabBarIcon';



export default function App() {

    const isLong = useWindowDimensions().width >= 1080;
    return (
        <DrawerNavigator screenOptions={{
            drawerType: isLong ? "permanent" : "front",
        }} />
    );
}

export const getNavOptions = (): BottomTabNavigationOptions => ({
    headerShown: true,
    title: 'Home',
    tabBarIcon: (props) => <TabBarIcon {...props} name="home-outline" />
})


// export default function App({ navigation }) {
//     return (
//         <View
//             style={{
//                 margin: 24,
//                 borderRadius: 20,
//                 flex: 1,
//                 backgroundColor: "crimson",
//                 padding: 24,
//                 alignItems: "stretch",
//             }}
//         >
//             <Text
//                 style={{ position: "absolute", top: 8, left: 8 }}
//                 onPress={() => {
//                     navigation.goBack();
//                 }}
//             >
//                 {__filename}
//             </Text>
//         </View>
//     );
// }
