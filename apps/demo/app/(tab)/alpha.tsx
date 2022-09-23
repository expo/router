import { StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { useState } from "react";

export default function Page() {
    const [state, setState] = useState(0);
    return (
        <View style={styles.container}>
            <Tabs.Screen options={{
                title: "Hey: " + state,
                headerRight: () => (
                    <Text onPress={() => {
                        alert('hey')
                    }} style={{
                        padding: 8
                    }}>Right</Text>
                )
            }} />
            <View style={styles.main}>
                <Text onPress={() => {
                    setState(state + 1)
                }} style={styles.title}>Hello World</Text>
                <Text style={styles.subtitle}>
                    This is the first page of your{"\n"}native app, and website.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    main: {
        flex: 1,
        justifyContent: "center",
        maxWidth: 960,
        marginHorizontal: "auto",
    },
    title: {
        fontSize: 64,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 36,
        color: "#38434D",
    },
});
