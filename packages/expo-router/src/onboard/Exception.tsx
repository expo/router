import React from 'react';
import { Platform, ScrollView, StyleSheet, ViewStyle, Text, TouchableOpacity, View } from 'react-native';
import { Link } from '@react-navigation/native';
import { ErrorBoundaryProps } from '../ErrorBoundary';

export function Exception({ error, retry }: ErrorBoundaryProps) {
    return (
        // @ts-ignore
        <View accessibilityRole='main' style={[styles.container]}>
            <View style={{ maxWidth: 720, marginHorizontal: 'auto' }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text
                        // @ts-ignore
                        accessibilityRole="heading" accessibilityLevel={1}
                        style={styles.title}
                    >
                        Something went wrong
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={retry} style={{
                            marginHorizontal: 8,
                        }}>
                            <ButtonContents title="Retry" />
                        </TouchableOpacity>
                        <Link to="/" style={{ color: 'white' }}>
                            <ButtonContents title="Back" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
                        </Link>
                    </View>
                </View>

                <StackTrace error={error} />


            </View>
        </View>
    );
}

function StackTrace({ error }: { error: Error }) {
    return (
        <ScrollView style={{ marginVertical: 8, borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1, padding: 12, }}>
            <Text style={[styles.code, { color: 'white' }]}>
                {error.stack}
            </Text>
        </ScrollView>
    );
}

function ButtonContents({ title, style }: { title: string, style?: ViewStyle }) {
    return (
        <View style={[{ backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, }, style]}>
            <Text style={styles.buttonText}>
                {title}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        padding: 24,
        alignItems: "stretch",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 24,

        // textAlign: "center",
        fontWeight: "bold",
    },
    buttonText: {
        fontWeight: 'bold',
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
        // textAlign: "center",
    },
    link: { color: "rgba(255,255,255,0.4)", textDecorationStyle: 'solid', textDecorationLine: 'underline', fontSize: 14, textAlign: "center" },
});
