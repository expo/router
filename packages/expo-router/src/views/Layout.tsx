import { TabRouter, useNavigationBuilder } from '@react-navigation/native';
import * as React from 'react';

import { useScreens } from '../useScreens';

// TODO: This might already exist upstream, maybe something like `useCurrentRender` ?
export const LayoutContext = React.createContext<any>(null);

if (process.env.NODE_ENV !== "production") {
    LayoutContext.displayName = "LayoutContext";
}

export type LayoutProps = {
    initialRouteName?: Parameters<typeof useNavigationBuilder>[1]['initialRouteName'];
    screenOptions?: Parameters<typeof useNavigationBuilder>[1]['screenOptions'];
    children?: Parameters<typeof useNavigationBuilder>[1]['children'];
    router?: Parameters<typeof useNavigationBuilder>[0];
}

/** An unstyled custom navigator. Good for basic web layouts */
export function Layout({
    initialRouteName,
    screenOptions,
    children,
    router = TabRouter,
}: LayoutProps) {
    const screens = useScreens();

    const { state, navigation, descriptors, NavigationContent } =
        useNavigationBuilder(router, {
            children: screens,
            screenOptions,
            initialRouteName,
        });

    return (
        <LayoutContext.Provider value={{ state, navigation, descriptors, router }}>
            <NavigationContent>{children}</NavigationContent>
        </LayoutContext.Provider>
    );
}

export function useLayoutContext() {
    const context = React.useContext(LayoutContext);
    if (!context) {
        throw new Error(
            "useLayoutContext must be used within a <Layout />"
        );
    }
    return context;
}

function useChild() {
    const context = React.useContext(LayoutContext);

    const { state, descriptors } = context;
    const current = state.routes.find((route, i) => state.index === i);
    if (!current) {
        return null;
    }
    return descriptors[current.key]?.render() ?? null;
}

/** Renders the currently selected content. */
export function Children(props: Omit<LayoutProps, 'children'>) {
    const context = React.useContext(LayoutContext);
    if (!context) {
        // Qualify the content and re-export.
        return (
            <Layout {...props}>
                <Children />
            </Layout>
        );
    }

    return useChild();
}

Layout.Children = Children;
Layout.useContext = useLayoutContext;
