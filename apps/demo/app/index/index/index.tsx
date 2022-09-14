import { Link } from '@react-navigation/native';
import { Text, View } from 'react-native';

import { TabBarIcon } from "../../../components/TabBarIcon";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

export const getNavOptions = (): DrawerNavigationOptions => ({
    title: 'Home',
    drawerIcon: (props) => <TabBarIcon {...props} name="home-outline" />
})


export default function App({ navigation }) {
    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "crimson",
                padding: 24,
                alignItems: "center",
                justifyContent: "center",
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
            <Link
                style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}
                to={"/modal"}
            >
                Push modal
            </Link>

            <Link
                style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}
                to={"/card"}
            >
                Push card
            </Link>
        </View>
    );
}
