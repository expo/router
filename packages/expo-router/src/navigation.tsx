import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import React from 'react';

import { useScreensRecord } from './useScreens';
import { Screen } from './views/Screen';

// TODO: Move to different files for babel tree shaking plugin.

// This is the only way to access the navigator.
const BottomTabNavigatorUpstream = createBottomTabNavigator().Navigator;
const StackNavigatorUpstream = createStackNavigator().Navigator;
const NativeStackNavigatorUpstream = createNativeStackNavigator().Navigator;
const DrawerNavigatorUpstream = createDrawerNavigator().Navigator;

type PickPartial<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;


function useSortedChildren(children: Record<string, React.ReactNode>, order?: { name: string, options?: { [key: string]: any } }[]): React.ReactNode[] {
    return React.useMemo(() => {
        if (!order?.length) {
            return Object.values(children);
        }
        const entries = Object.entries(children);

        const ordered = order.map(({ name, options }) => {
            const matchIndex = entries.findIndex((child) => child[0] === name)
            if (matchIndex === -1) {
                console.warn(`[Layout children]: No route named "${name}" exists in nested children:`, Object.keys(children));
                return null;
            } else {
                // Get match and remove from entries
                const [, match] = entries[matchIndex];
                entries.splice(matchIndex, 1);
                // @ts-expect-error
                return React.cloneElement(match, { options });
            }
        }).filter(Boolean)

        // Add any remaining children
        // @ts-expect-error
        ordered.push(...entries.map(([, child]) => child));

        return ordered;
    }, [children, order]);
}

/** Return a navigator that automatically injects matched routes and renders nothing when there are no children. Return type with children prop optional */
function createWrappedNavigator<TOptions extends {}, T extends React.ComponentType<any>>(
    Nav: T): (React.ForwardRefExoticComponent<React.PropsWithoutRef<PickPartial<React.ComponentProps<T>, "children">> & React.RefAttributes<unknown>>) & {
        Screen: (props: {
            /** Name is required when used inside a Layout component. */
            name?: string, options: TOptions
        }) => null
    } {


    const Navigator = React.forwardRef(({ children: userDefinedChildren, ...props }: PickPartial<React.ComponentProps<T>, 'children'>, ref) => {
        const userDefinedOptions = React.useMemo(() => {
            const screens = React.Children.map(userDefinedChildren, (child) => {
                if (React.isValidElement(child) && child && child.type === Screen) {
                    if (!child.props.name) {
                        throw new Error('Screen must have a name prop when used as a child of a Layout');
                    }
                    if (process.env.NODE_ENV !== 'production') {
                        if (['children', 'component', 'getComponent'].some((key) => key in child.props)) {
                            throw new Error('Screen must not have a children, component, or getComponent prop when used as a child of a Layout');
                        }
                    }
                    return child.props;
                } else {
                    console.warn('Layout children must be of type Screen, all other children are ignored. To use custom children, create a custom <Layout />.');
                }
            })

            if (process.env.NODE_ENV !== 'production') {
                // Assert if names are not unique
                const names = screens?.map((screen) => screen.name);
                if (names && new Set(names).size !== names.length) {
                    throw new Error('Screen names must be unique: ' + names);
                }
            }

            return screens;
        }, [userDefinedChildren]);

        const children = useScreensRecord();

        const sorted = useSortedChildren(children, userDefinedOptions);

        // Prevent throwing an error when there are no screens.
        if (!sorted.length) {
            return null;
        }

        // @ts-expect-error
        return <Nav {...props} ref={ref} children={sorted} />;
    });

    // @ts-expect-error
    Navigator.Screen = Screen;
    // @ts-expect-error
    return Navigator;
}

export const Tabs = createWrappedNavigator<BottomTabNavigationOptions, typeof BottomTabNavigatorUpstream>(BottomTabNavigatorUpstream);
export const Stack = createWrappedNavigator<StackNavigationOptions, typeof StackNavigatorUpstream>(StackNavigatorUpstream);
export const NativeStack = createWrappedNavigator<NativeStackNavigationOptions, typeof NativeStackNavigatorUpstream>(NativeStackNavigatorUpstream);
export const Drawer = createWrappedNavigator<DrawerNavigationOptions, typeof DrawerNavigatorUpstream>(DrawerNavigatorUpstream);



