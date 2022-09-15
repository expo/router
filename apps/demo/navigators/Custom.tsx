import { A, Nav } from '@expo/html-elements';
import { Slot } from '@radix-ui/react-slot';
import { TabActions, TabRouter, useNavigationBuilder } from '@react-navigation/native';
import { useNavigationChildren } from 'expo-router';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export const BuilderContext = React.createContext<any>(null);
export const TabContext = React.createContext<any>(null);

export function Navigator({ initialRouteName, backBehavior, screenOptions, children, router = TabRouter }: {
    initialRouteName?: string;
    backBehavior?: 'initialRoute' | 'history' | 'order' | 'none';
    screenOptions?: any;
    children?: any;
    router?: any;
}) {
    const screens = useNavigationChildren();

    const { state, navigation, descriptors, NavigationContent } =
        useNavigationBuilder(router, {
            children: screens,
            screenOptions,
            initialRouteName,
            backBehavior
        });

    return (
        <BuilderContext.Provider value={{ state, navigation, descriptors }}>
            <NavigationContent>{children}</NavigationContent>
        </BuilderContext.Provider>
    );
}

function TabBar({ style, children }) {
    const childrenArray = React.Children.toArray(children);

    const newChildren = React.useMemo(() => childrenArray.map((child, index) => {
        return (
            <Slot
                key={String(index)}
                style={{ justifyContent: 'center', alignItems: 'center', display: "flex" }}
            >
                {child}
            </Slot>
        );
    }), [childrenArray]);
    return (
        <Nav style={[{ flexDirection: "row", zIndex: 999 }, style]}>
            {newChildren}
        </Nav>
    );
}

const Tab = React.forwardRef(({ to, children, style, ...props }, ref) => {

    const { state, navigation } = React.useContext(BuilderContext);

    const routeKey = React.useMemo(() => {
        const route = state.routes.find((route) => route.name === to);
        if (process.env.NODE_ENV === 'development' && !route) {
            throw new Error(`No route with name "${to}" found. Options are: ${state.routes.map((route) => route.name).join(", ")}`);
        }
        return route.key;
    }, [to]);


    const onPress = React.useCallback(() => {
        const event = navigation.emit({
            type: "tabPress",
            target: routeKey,
            canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
            navigation.dispatch({
                ...TabActions.jumpTo(to),
                target: state.key,
            });
        }
    }, [to, routeKey, state, navigation]);

    const Klass = typeof children === 'string' ? A : View;

    return (
        <Pressable
            ref={ref}
            onPress={onPress}
            style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, style]}
        >
            <Klass {...props}>{children}</Klass>
        </Pressable>
    );
})

/** Renders the currently selected content. */
export function Content() {
    const { state, descriptors } = React.useContext(BuilderContext);
    const current = state.routes.find((route, i) => state.index === i);
    if (!current) {
        return null;
    }
    return descriptors[current.key]?.render() ?? null;
}

Navigator.Content = Content;

// TabNavigator.Content = Content;
// TabNavigator.Tab = Tab;
// TabNavigator.TabBar = TabBar;
