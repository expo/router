import React from 'react';
import { StyleSheet, TouchableOpacity, Platform, Text, View } from 'react-native';
import { DOCS_URL, createEntryFileAsync } from './createEntryFile';

// TODO: hotter

export function Tutorial() {
    return (
        // @ts-ignore
        <View accessibilityRole='main' style={styles.container}>
            <Text
                // @ts-ignore
                accessibilityRole="heading" accessibilityLevel={1}
                style={styles.title}
            >
                Welcome to Expo
            </Text>
            {/* @ts-expect-error */}
            <Text accessibilityRole="heading" accessibilityLevel={2} style={styles.subtitle}>To get started, create a file in the `app/` folder which exports a React component.</Text>
            <Button />
            {/* @ts-expect-error */}
            <Text href={DOCS_URL} style={styles.link}>
                Learn more about expo/router.
            </Text>
        </View>
    );
}

function Button() {
    return (
        <TouchableOpacity onPress={() => {
            createEntryFileAsync()
        }} style={{
            margin: 8,
        }}>
            <View style={{ backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, }}>
                <Text style={styles.buttonText}>
                    Create <Text style={styles.code}>app/index.js</Text> file
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 24,
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomColor: "rgba(255,255,255,0.4)",
        borderBottomWidth: 1,
        textAlign: "center",
        fontWeight: "bold",
    },
    buttonText: {
        color: 'black',
    },
    code: {
        fontFamily: Platform.select({ default: 'Courier', ios: 'Courier New', android: 'monospace' }),
        fontWeight: '500',
    },
    subtitle: {
        color: "white",
        fontSize: 14,
        marginBottom: 12,
        textAlign: "center",
    },
    link: { position: 'absolute', bottom: 24, left: 24, right: 24, color: "rgba(255,255,255,0.8)", fontSize: 14, textAlign: "center" },
});
