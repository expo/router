
import { View, Text } from "react-native";

import { useChild } from "expo-router";

export default function App() {
    // TODO: This currently doesn't work with linking because there's no in-memory navigator.

    // Get the child component matching the current route.
    // Think of this like `<Outlet />` in React Router.
    const children = useChild();
    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "green",
                padding: 24,
                alignItems: "stretch",
            }}
        >
            <Text style={{ position: 'absolute', top: 8, left: 8 }}>{__filename}</Text>
            {children}
        </View>
    );
}
