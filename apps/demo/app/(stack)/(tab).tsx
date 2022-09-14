import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { BottomTabNavigator } from "expo-router";

export default function Tab() {
    return <BottomTabNavigator />;
}

export const getNavOptions = (): BottomTabNavigationOptions => ({
    title: "Home",
});
