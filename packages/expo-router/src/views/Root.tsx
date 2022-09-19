import "react-native-gesture-handler";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';

import React from "react";

import { ContextNavigator } from '../ContextNavigator';

// @ts-expect-error: welp
type ContextModule = ReturnType<typeof require.context>;

export function ExpoRoot({ context }: { context: ContextModule }) {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ContextNavigator context={context} />
                {/* Users can override this by adding another StatusBar element anywhere higher in the component tree. */}
                <StatusBar style="auto" />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
