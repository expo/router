import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { DrawerNavigator } from 'expo-router';

export default function Tab() {
  return <DrawerNavigator />;
}

export const getNavOptions = (): BottomTabNavigationOptions => ({
  title: "Home",
});
