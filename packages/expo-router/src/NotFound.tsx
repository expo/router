import React, { forwardRef } from 'react';
import { useURL } from 'expo-linking';
import { StyleSheet, Text, View } from 'react-native';

export const NotFound = forwardRef((props, ref) => {
    const url = useURL();
    return (
        // @ts-ignore
        <View ref={ref} accessibilityRole='main' style={styles.container}>
            <Text
                // @ts-expect-error
                accessibilityRole="heading" accessibilityLevel={1}
                style={styles.title}
            >
                Not Found
            </Text>
            {/* @ts-expect-error */}
            <Text accessibilityRole="heading" accessibilityLevel={2} style={styles.subtitle}>Page could not be found. {/* @ts-expect-error */}
                <Text href={'/'} style={styles.link}>
                    Go back.
                </Text></Text>
            {/* @ts-expect-error */}
            <Text href={url} style={styles.link}>
                {url}
            </Text>

        </View>
    );
})

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
    subtitle: {
        color: "white",
        fontSize: 14,
        marginBottom: 12,
        textAlign: "center",
    },
    link: { color: "rgba(255,255,255,0.4)", fontSize: 14, textAlign: "center" },
});
