import { TabRouter, useNavigationBuilder } from "@react-navigation/native";

import * as React from "react";
import { useNavigationChildren } from "./routes";

// TODO: This might already exist upstream, maybe something like `useCurrentRender` ?
export const NavigatorContext = React.createContext<any>(null);

if (process.env.NODE_ENV !== "production") {
    NavigatorContext.displayName = "NavigatorContext";
}

/** An unstyled custom navigator. Good for basic web layouts */
export function Navigator({
    initialRouteName,
    backBehavior,
    screenOptions,
    children,
    router = TabRouter,
}: {
    initialRouteName?: string;
    backBehavior?: "initialRoute" | "history" | "order" | "none";
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
            backBehavior,
        });

    return (
        <NavigatorContext.Provider value={{ state, navigation, descriptors }}>
            <NavigationContent>{children}</NavigationContent>
        </NavigatorContext.Provider>
    );
}

function useCurrentScreen(context) {
    const { state, descriptors } = context;
    const current = state.routes.find((route, i) => state.index === i);
    if (!current) {
        return null;
    }
    return descriptors[current.key]?.render() ?? null;
}

/** Renders the currently selected content. */
export function Content(props) {
    const context = React.useContext(NavigatorContext);
    if (!context) {
        // Qualify the content and re-export.
        return (
            <Navigator {...props}>
                <Content />
            </Navigator>
        );
    }

    return useCurrentScreen(context);
}

Navigator.Content = Content;
