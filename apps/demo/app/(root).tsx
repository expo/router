import { NativeStack } from "expo-router";

import { useCurrentRoute } from 'expo-router';

export default function Layout() {
    const url = useCurrentRoute();
    console.log('url', url);
    return (
        <NativeStack>
            <NativeStack.Screen
                name="(tab)"
                options={{
                    headerShown: false,
                }}
            />
            <NativeStack.Screen
                name="modal"
                options={{
                    presentation: "modal",
                }}
            />
        </NativeStack>
    );
}
