// https://www.instagram.com/baconbrix/
// Profile header component and sticky middle tab bar:
// [ ⬤ Baconbrix (...) ]
// [     =  =  =  =     ]
// [--------------------]
// [   (Nested Route)   ]

import { View } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigationChildren } from "expo-router";

const Nav = createMaterialTopTabNavigator();


// import { useChild } from "expo-router";

export const getNavOptions = () => {
    return {
        title: "Profile",
    };
};


export default function App() {
    // const children = useChild();
    const children = useNavigationChildren();
    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "orange",
                padding: 24,
                alignItems: "stretch",
            }}
        >
            <View
                style={{
                    height: 256,
                }}
            />
            <Nav.Navigator children={children} />

        </View>
    );
}
