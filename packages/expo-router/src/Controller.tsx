import "react-native-gesture-handler";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer } from "@react-navigation/native";
import React, { useMemo } from "react";

import { CurrentRoute, RoutesContext } from "./routes";

import { getRoutes, getLinkingConfig } from "./getRoutes";

// @ts-expect-error: welp
type RequireContext = ReturnType<typeof require.context>;

export function AutoNav({ context }: { context: RequireContext }) {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <Controller context={context} />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export function Controller({ context, children }: { context: RequireContext; children?: React.ReactNode }) {
    const { Initial, key, routes, linking } = useMemo(() => {
        const keys = context.keys();
        const initialKeys = keys.filter((value) =>
            value.match(/^\.\/[^/]+\.(js|ts)x?$/)
        );
        if (!initialKeys.length) {
            console.warn('No initial route found in the app directory.');

        }
        if (initialKeys.length > 1) {
            console.warn('Multiple initial routes found in the app directory.');
        }
        const Initial = interopDefault(context(initialKeys[0]));

        const routes = getRoutes(context);

        const linking = getLinkingConfig(routes);
        // console.log('routes', routes);
        return { Initial, key: initialKeys[0], routes, linking };
    }, [context.keys()]);

    return (
        <RoutesContext.Provider value={routes}>
            <CurrentRoute filename={key}>
                <NavigationContainer linking={linking}>
                    {children ?? <Initial />}
                </NavigationContainer>
            </CurrentRoute>
        </RoutesContext.Provider>
    );
}
function interopDefault(mod) {
    return mod?.default ?? mod;
}

