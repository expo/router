import React from 'react';
import { SafeAreaView, StatusBar, Platform } from 'react-native';
import { View, Text, Pressable, StyleSheet } from '@bacons/react-views';
import { DOCS_URL, createEntryFileAsync } from './createEntryFile';

import Reanimated, { FadeIn } from 'react-native-reanimated';



// TODO: hotter

export function Tutorial() {


    React.useEffect(() => {
        // Reset the route on web so the initial route isn't a 404 after
        // the user has created the entry file.
        // This is useful for cases where you are testing the tutorial.
        // To test: touch the new file, then navigate to a missing route `/foobar`, then delete the app folder.
        // you should see the tutorial again and be able to create the entry file once more.
        if (typeof location !== 'undefined' && location.pathname !== '/') {
            location.replace('/');
        }
    }, []);

    return (
        <View style={{ backgroundColor: 'black', flex: 1, }}>
            <Reanimated.View entering={FadeIn} style={{ flex: 1 }}>
                <StatusBar barStyle={"light-content"} />


                <SafeAreaView style={{ flex: 1, maxWidth: 960, marginHorizontal: 'auto', alignItems: "stretch", paddingHorizontal: 24, }}>
                    <View accessibilityRole='main' style={styles.container}>

                        <Pressable>
                            {({ hovered }) => (
                                <Text
                                    accessibilityRole="heading" accessibilityLevel={1}
                                    style={[styles.title, Platform.OS !== 'web' && { textAlign: 'left' }]}
                                >
                                    Welcome to <Text href="https://expo.dev/" style={[{
                                        ...Platform.select({
                                            web: {
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                textFillColor: 'transparent',
                                                color: 'transparent',
                                                backgroundImage: 'linear-gradient(90deg,#9344F9,#B200F0)'
                                            },
                                            default: {
                                                color: '#9344F9'
                                            }
                                        })
                                    }, hovered && {
                                        textDecorationColor: 'white',
                                        textDecorationLine: 'underline'
                                    }]}>Expo</Text>
                                </Text>

                            )}
                        </Pressable>
                        <Text accessibilityRole="heading" accessibilityLevel={2} style={[styles.subtitle, Platform.OS !== 'web' && { textAlign: 'left' }]}>Create a file in the <Text style={{ fontWeight: 'bold' }}>app/</Text> folder and export a React component.</Text>
                        <Button />

                    </View>
                    {Platform.OS === 'web' && <Footer />}
                </SafeAreaView>
            </Reanimated.View>
        </View>
    );
}

function Footer() {
    return (
        <View style={{ borderTopColor: '#BCC3CD', borderTopWidth: 1, paddingVertical: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ExpoLogo />

            <Text href={DOCS_URL} >

                <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {({ hovered }) => (
                        <>
                            <Text style={{ fontWeight: 'bold', color: '#BCC3CD', fontSize: 16, marginRight: 16 }}>Examples</Text>
                            <View style={[{
                                transitionDuration: '200ms',
                            }, hovered && { transform: [{ translateX: 10 }] }]}>
                                <svg width="28" height="23" viewBox="0 0 28 23" fill="#BCC3CD" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.18 11.3302V11.4502C27.18 11.4502 27.18 11.5502 27.18 11.5902C27.1607 11.6388 27.1373 11.6856 27.11 11.7302C27.0937 11.7656 27.0736 11.7992 27.05 11.8302C27.0014 11.9064 26.9444 11.9768 26.88 12.0402L17.29 21.6402C17.1596 21.7732 17.0041 21.8789 16.8323 21.9511C16.6606 22.0232 16.4763 22.0604 16.29 22.0604C16.1037 22.0604 15.9194 22.0232 15.7477 21.9511C15.5759 21.8789 15.4204 21.7732 15.29 21.6402C15.1545 21.5113 15.0465 21.3562 14.9728 21.1843C14.899 21.0124 14.861 20.8273 14.861 20.6402C14.861 20.4531 14.899 20.268 14.9728 20.0961C15.0465 19.9242 15.1545 19.7691 15.29 19.6402L22.5 12.4202H1.39C1.02135 12.4202 0.667797 12.2738 0.407122 12.0131C0.146446 11.7524 0 11.3989 0 11.0302C0 10.6616 0.146446 10.308 0.407122 10.0473C0.667797 9.78665 1.02135 9.6402 1.39 9.6402H22.45L15.24 2.4202C15.1044 2.2913 14.9965 2.13618 14.9228 1.96427C14.849 1.79237 14.811 1.60726 14.811 1.4202C14.811 1.23315 14.849 1.04804 14.9228 0.876137C14.9965 0.704231 15.1044 0.549111 15.24 0.420204C15.3703 0.287165 15.5259 0.181474 15.6977 0.10932C15.8694 0.0371659 16.0537 0 16.24 0C16.4263 0 16.6106 0.0371659 16.7823 0.10932C16.9541 0.181474 17.1096 0.287165 17.24 0.420204L26.8 10.0902C26.8621 10.1591 26.919 10.2327 26.97 10.3102C26.9936 10.3412 27.0137 10.3748 27.03 10.4102C27.0573 10.4548 27.0807 10.5016 27.1 10.5502C27.1 10.5502 27.1 10.6402 27.1 10.6902C27.1 10.7402 27.1 10.7602 27.1 10.8102C27.14 10.988 27.14 11.1724 27.1 11.3502L27.18 11.3302Z" fill="#BCC3CD" />
                                </svg>
                            </View>
                        </>
                    )}
                </Pressable>
            </Text >
        </View >
    )
}

function ExpoLogo() {
    return (
        <svg width="48" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 38.4615C0.086 39.5408 0.46 40.6261 1.436 42.082C2.596 43.8109 4.588 44.7598 6.042 43.2366C7.022 42.2083 17.63 23.3298 22.742 16.1743C22.8823 15.9697 23.069 15.8026 23.2863 15.6873C23.5035 15.5719 23.745 15.5117 23.99 15.5117C24.235 15.5117 24.4765 15.5719 24.6937 15.6873C24.911 15.8026 25.0977 15.9697 25.238 16.1743C30.35 23.3298 40.958 42.2083 41.938 43.2366C43.392 44.7598 45.384 43.8109 46.544 42.082C47.684 40.3817 48 39.1905 48 37.9158C48 37.0483 31.48 5.74642 29.816 3.13996C28.216 0.635323 27.728 0.0895969 25.022 0H22.958C20.252 0.0895969 19.764 0.633287 18.162 3.13996C16.534 5.69144 0.66 35.7614 0 37.8221V38.4615Z" fill="#BCC3CD" />
        </svg>
    )
}

function Button() {
    return (
        <Pressable
            onPress={() => {
                createEntryFileAsync()
            }}
            style={{
                margin: 8,
                ...Platform.select({
                    native: {
                        position: 'absolute',
                        bottom: 8,
                        left: 24,
                        right: 24,
                    }
                })
            }}>
            {({ hovered }) => (

                <View style={[{
                    transitionDuration: '200ms',
                    backgroundColor: 'transparent', borderColor: 'white', borderWidth: 2, paddingVertical: 12, paddingHorizontal: 24,
                }, hovered && {
                    backgroundColor: 'white'
                }]}>
                    <Text style={[{ fontSize: 18, transitionDuration: '200ms', fontWeight: 'bold', color: 'white' }, styles.code, hovered && { color: 'black' }]}>
                        <Text style={{ opacity: 0.5 }}>$</Text> touch app/index.js
                    </Text>
                </View>
            )}
        </Pressable>
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
        fontSize: Platform.select<string | number>({
            web: '4rem',
            default: 64
        }),
        paddingBottom: 24,
        marginBottom: 24,
        // borderBottomColor: "rgba(255,255,255,0.4)",
        // borderBottomWidth: 1,
        textAlign: "center",
        fontWeight: "bold",
    },
    buttonText: {
        color: 'black',
    },
    code: {
        fontFamily: Platform.select({ default: 'Courier', ios: 'Courier New', android: 'monospace' }),
        // fontWeight: '500',
    },
    subtitle: {
        color: "#BCC3CD",
        fontSize: Platform.select<string | number>({
            web: '2rem',
            default: 36
        }),
        marginBottom: 24,
        textAlign: "center",
    },
    link: { position: 'absolute', bottom: 24, left: 24, right: 24, color: "rgba(255,255,255,0.8)", fontSize: 14, textAlign: "center" },
});
