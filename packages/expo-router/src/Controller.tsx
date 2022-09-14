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
    const { Initial, routes, linking } = useMemo(() => {
        const keys = context.keys();
        const initialKey = keys.find((value) =>
            value.match(/^\.\/index\.(js|ts)x?$/)
        );
        const Initial = interopDefault(context(initialKey));

        const routes = getRoutes(context);

        const linking = getLinkingConfig(routes);
        return { Initial, routes, linking };
    }, context.keys());

    console.log("linking:", linking);

    return (
        <RoutesContext.Provider value={routes}>
            <CurrentRoute filename="./index">
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

