import "react-native-gesture-handler";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import React from "react";

import { ContextNavigator } from './ContextNavigator';

// @ts-expect-error: welp
type RequireContext = ReturnType<typeof require.context>;

export function Root({ context }: { context: RequireContext }) {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ContextNavigator context={context} />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
