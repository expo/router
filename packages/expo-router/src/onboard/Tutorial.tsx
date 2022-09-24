import React from "react";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { View, Text, Pressable, StyleSheet } from "@bacons/react-views";
import { createEntryFileAsync } from "./createEntryFile";

// TODO: Use openLinkFromBrowser thing
function Header() {
    return (
        <Pressable>
            {({ hovered }) => (
                <Text
                    accessibilityRole="heading"
                    accessibilityLevel={1}
                    style={[styles.title, Platform.OS !== "web" && { textAlign: "left" }]}
                >
                    Welcome to{" "}
                    <Text
                        href="https://github.com/expo/expo-router/"
                        style={[
                            hovered && {
                                textDecorationColor: "white",
                                textDecorationLine: "underline",
                            },
                        ]}
                    >
                        Expo
                    </Text>
                </Text>
            )}
        </Pressable>
    );
}

const canAutoTouchFile = process.env.EXPO_ROUTER_APP_ROOT != null;

export function Tutorial() {
    React.useEffect(() => {
        // Reset the route on web so the initial route isn't a 404 after
        // the user has created the entry file.
        // This is useful for cases where you are testing the tutorial.
        // To test: touch the new file, then navigate to a missing route `/foobar`, then delete the app folder.
        // you should see the tutorial again and be able to create the entry file once more.
        if (typeof location !== "undefined" && location.pathname !== "/") {
            location.replace("/");
        }
        if (typeof window !== "undefined") {
            window.document.title = "npx expo start";
        }
    }, []);

    return (
        <View
            style={{
                backgroundColor: "black",
                flex: 1,
                backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
                backgroundPosition: "-3px -3px",
                backgroundSize: "40px 40px",
            }}
        >
            <StatusBar barStyle="light-content" />

            <SafeAreaView
                style={{
                    flex: 1,
                    maxWidth: 960,
                    marginHorizontal: "auto",
                    alignItems: "stretch",
                }}
            >
                <View accessibilityRole="main" style={styles.container}>
                    <Header />
                    <Text
                        accessibilityRole="heading"
                        accessibilityLevel={2}
                        style={styles.subtitle}
                    >
                        Get started by creating a file{"\n"}in the{" "}
                        <Text style={{ fontWeight: "bold" }}>app</Text> directory{"\n"}that
                        exports a React component.
                    </Text>
                    {canAutoTouchFile && <Button />}
                </View>
            </SafeAreaView>
        </View>
    );
}

function Button() {
    return (
        <Pressable
            onPress={() => {
                createEntryFileAsync();
            }}
            style={{
                ...Platform.select({
                    native: {
                        position: "absolute",
                        bottom: 8,
                        left: 24,
                        right: 24,
                    },
                }),
            }}
        >
            {({ pressed, hovered }) => (
                <View
                    style={[
                        {
                            transitionDuration: "200ms",
                            backgroundColor: "transparent",
                            borderColor: "white",
                            borderWidth: 2,
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                        },
                        hovered && {
                            backgroundColor: "white",
                        },
                        pressed && {
                            backgroundColor: "rgba(255,255,255,0.7)",
                        },
                    ]}
                >
                    <Text
                        selectable={false}
                        style={[
                            {
                                fontSize: 18,
                                transitionDuration: "200ms",
                                fontWeight: "bold",
                                color: "white",
                            },
                            styles.code,
                            hovered && { color: "black" },
                        ]}
                    >
                        <Text style={{ color: "#BCC3CD" }}>$</Text> touch app/index.js
                    </Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        alignItems: "start",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 64,
        paddingBottom: 24,
        fontWeight: "bold",
    },
    buttonText: {
        color: "black",
    },
    code: {
        fontFamily: Platform.select({
            default: "Courier",
            ios: "Courier New",
            android: "monospace",
        }),
    },
    subtitle: {
        color: "#BCC3CD",
        fontSize: 36,
        fontWeight: "light",
        paddingBottom: 36,
        maxWidth: 960,
    },
});
