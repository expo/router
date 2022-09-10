import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigationChildren, } from './routes';

// This is the only way to access the navigator.
const BottomTabNavigatorUpstream = createBottomTabNavigator().Navigator;
const StackNavigatorUpstream = createStackNavigator().Navigator;
const NativeStackNavigatorUpstream = createNativeStackNavigator().Navigator;
const DrawerNavigatorUpstream = createDrawerNavigator().Navigator;

import React from 'react';

function createWrappedNavigator<T extends React.ComponentType<any>>(Nav: T): T {
    const Navigator = React.forwardRef(({ ...props, ctx }, ref) => {
        const children = useNavigationChildren(ctx);
        // Prevent throwing an error when there are no screens.
        if (!children.length) return null;
        return <Nav {...props} ref={ref} children={children} />;
    });
    return Navigator;
}

export const BottomTabNavigator = createWrappedNavigator(BottomTabNavigatorUpstream);
export const StackNavigator = createWrappedNavigator(StackNavigatorUpstream);
export const NativeStackNavigator = createWrappedNavigator(NativeStackNavigatorUpstream);
export const DrawerNavigator = createWrappedNavigator(DrawerNavigatorUpstream);

export { default as Screen } from '@react-navigation/core/src/Screen';
export { default as Group } from '@react-navigation/core/src/Group';

