import { TabActions, TabRouter, useNavigationBuilder } from '@react-navigation/native';
import * as React from 'react';

import { useScreens } from './routes';

// TODO: This might already exist upstream, maybe something like `useCurrentRender` ?
export const NavigatorContext = React.createContext<any>(null);

if (process.env.NODE_ENV !== "production") {
    NavigatorContext.displayName = "NavigatorContext";
}

export type NavigatorProps = {
    initialRouteName?: Parameters<typeof useNavigationBuilder>[1]['initialRouteName'];
    screenOptions?: Parameters<typeof useNavigationBuilder>[1]['screenOptions'];
    children?: Parameters<typeof useNavigationBuilder>[1]['children'];
    router?: Parameters<typeof useNavigationBuilder>[0];
}

/** An unstyled custom navigator. Good for basic web layouts */
export function Navigator({
    initialRouteName,
    screenOptions,
    children,
    router = TabRouter,
}: NavigatorProps) {
    const screens = useScreens();

    const { state, navigation, descriptors, NavigationContent } =
        useNavigationBuilder(router, {
            children: screens,
            screenOptions,
            initialRouteName,
        });

    return (
        <NavigatorContext.Provider value={{ state, navigation, descriptors, router }}>
            <NavigationContent>{children}</NavigationContent>
        </NavigatorContext.Provider>
    );
}

// TODO: Support all routers and document
function useClientSideEvent(to) {
    const { navigation, state, router } = useNavigatorContext();

    const routeKey = React.useMemo(() => {
        const route = state.routes.find((route) => route.name === to);
        if (process.env.NODE_ENV === 'development' && !route) {
            throw new Error(`No route with name "${to}" found. Options are: ${state.routes.map((route) => route.name).join(", ")}`);
        }
        return route.key;
    }, [to]);

    const onPress = React.useCallback(() => {
        if (router === TabRouter) {
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
        } else {
            throw new Error(`router is not supported: ${router}`);
        }
    }, [to, routeKey, router, state, navigation]);

    return onPress;
}

export function useNavigatorContext() {
    const context = React.useContext(NavigatorContext);
    if (!context) {
        throw new Error(
            "useNavigatorContext must be used within a <Navigator />"
        );
    }
    return context;
}

function useChild() {
    const context = React.useContext(NavigatorContext);

    const { state, descriptors } = context;
    const current = state.routes.find((route, i) => state.index === i);
    if (!current) {
        return null;
    }
    return descriptors[current.key]?.render() ?? null;
}

/** Renders the currently selected content. */
export function Children(props: Omit<NavigatorProps, 'children'>) {
    const context = React.useContext(NavigatorContext);
    if (!context) {
        // Qualify the content and re-export.
        return (
            <Navigator {...props}>
                <Children />
            </Navigator>
        );
    }

    return useChild();
}

Navigator.Children = Children;
Navigator.useContext = useNavigatorContext;
Navigator.useClientSideEvent = useClientSideEvent;
