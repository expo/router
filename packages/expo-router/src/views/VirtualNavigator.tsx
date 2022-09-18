import React from 'react';
import { NativeStack } from "../navigation"

export function VirtualNavigator() {
    return (<NativeStack screenOptions={{ animation: 'none', headerShown: false }} />)
}