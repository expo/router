import "react-native-gesture-handler";

import React from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';

import { ContextNavigator } from '../ContextNavigator';
import { RequireContext } from '../types';


export function ExpoRoot({ context }: { context: RequireContext }) {
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
