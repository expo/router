import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { withLayoutContext } from './withLayoutContext';

// This is the only way to access the navigator.
const BottomTabNavigator = createBottomTabNavigator().Navigator;

export const Tabs = withLayoutContext<BottomTabNavigationOptions, typeof BottomTabNavigator>(BottomTabNavigator);
