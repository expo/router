import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { useNamedNavigationChildren } from './routes';

// TODO: Move to different files for babel tree shaking plugin.

// This is the only way to access the navigator.
const BottomTabNavigatorUpstream = createBottomTabNavigator().Navigator;
const StackNavigatorUpstream = createStackNavigator().Navigator;
const NativeStackNavigatorUpstream = createNativeStackNavigator().Navigator;
const DrawerNavigatorUpstream = createDrawerNavigator().Navigator;

type PickPartial<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;


function useSortedChildren(children: Record<string, React.ReactNode>, order?: string[]): React.ReactNode[] {
    return React.useMemo(() => {
        if (!order) return Object.values(children);
        const entries = Object.entries(children);

        const ordered = order.map(name => {
            const matchIndex = entries.findIndex((child) => child[0] === name)
            if (matchIndex === -1) {
                console.warn(`[ORDER]: No route named "${name}" exists in nested children:`, Object.keys(children));
                return null;
            } else {
                // Get match and remove from entries
                const [, match] = entries[matchIndex];
                entries.splice(matchIndex, 1);
                return match;
            }
        }).filter(Boolean)

        // Add any remaining children
        ordered.push(...entries.map(([, child]) => child));

        return ordered;
    }, [children, order]);
}

/** Return a navigator that automatically injects matched routes and renders nothing when there are no children. Return type with children prop optional */
function createWrappedNavigator<T extends React.ComponentType<any>>(Nav: T) {

    const Navigator = React.forwardRef(({ order, ...props }: PickPartial<React.ComponentProps<T>, 'children'> & { order?: string[] }, ref) => {
        const children = useNamedNavigationChildren();

        const sorted = useSortedChildren(children, order);

        // Prevent throwing an error when there are no screens.
        if (!sorted.length) {
            return null;
        }

        // @ts-expect-error
        return <Nav {...props} ref={ref} children={sorted} />;
    });

    return Navigator;
}

export const Tabs = createWrappedNavigator(BottomTabNavigatorUpstream);
export const Stack = createWrappedNavigator(StackNavigatorUpstream);
export const NativeStack = createWrappedNavigator(NativeStackNavigatorUpstream);
export const Drawer = createWrappedNavigator(DrawerNavigatorUpstream);



