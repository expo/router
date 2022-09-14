// https://www.instagram.com/baconbrix/
// Profile header component and sticky middle tab bar:
// [ ⬤ Baconbrix (...) ]
// [     =  =  =  =     ]
// [--------------------]
// [   (Nested Route)   ]

import { View } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigationChildren, useNavigator } from "expo-router";

const Nav = createMaterialTopTabNavigator();


export const getNavOptions = () => {
    return {
        title: "Profile",
    };
};


export default function App() {
    const Navigator = useNavigator(Nav.Navigator);
    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "white",
                alignItems: "stretch",
            }}
        >
            <View
                style={{
                    height: 256,
                }}
            />
            <Navigator />

        </View>
    );
}
