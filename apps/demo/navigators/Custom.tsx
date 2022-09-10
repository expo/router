import { A, Nav } from '@expo/html-elements';
import { Slot } from '@radix-ui/react-slot';
import NavigationScreen from '@react-navigation/core/src/Screen';
import { TabActions, TabRouter, useNavigationBuilder } from '@react-navigation/native';
import { useNavigationChildren } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export const BuilderContext = React.createContext<any>(null);
export const TabContext = React.createContext<any>(null);

export function TabNavigator({ ctx, initialRouteName, screenOptions, children }) {
    const screens = useNavigationChildren(ctx);

    const { state, navigation, descriptors, NavigationContent } =
        useNavigationBuilder(TabRouter, {
            children: screens,
            screenOptions,
            initialRouteName,
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

function Screen() {
    const { state, descriptors } = React.useContext(BuilderContext);
    return state.routes.map((route, i) => {
        return (
            <View
                key={route.key}
                pointerEvents="box-none"
                style={[
                    StyleSheet.absoluteFill,
                    { display: i === state.index ? "flex" : "none" },
                ]}
            >
                {descriptors[route.key].render()}
            </View>
        );
    });
}

TabNavigator.Screen = Screen;
TabNavigator.Tab = Tab;
TabNavigator.TabBar = TabBar;
