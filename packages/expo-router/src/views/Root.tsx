import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';

import { ContextNavigator } from '../ContextNavigator';
import { RequireContext } from '../types';

function getGestureHandlerRootView() {
    try {
        return require("react-native-gesture-handler").GestureHandlerRootView as typeof import('react-native-gesture-handler').GestureHandlerRootView;
    } catch {
        return React.Fragment;
    }
}

export function ExpoRoot({ context }: { context: RequireContext }) {
    const GestureHandlerRootView = React.useMemo(() => getGestureHandlerRootView(), []);

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
