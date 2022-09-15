import React from 'react';
import { Platform, StyleSheet, ViewStyle, Text, TouchableOpacity, View } from 'react-native';

import { ErrorBoundaryProps } from '../ErrorBoundary';

// import { parseLogBoxException } from 'react-native/Libraries/LogBox/Data/parseLogBoxLog';
// import { LogBoxLog } from 'react-native/Libraries/LogBox/Data/LogBoxLog';


// function symbolicateAsync(error) {
//     return new Promise((resolve, reject) => {
//         const metroError = new LogBoxLog(parseLogBoxException(error));
//         if (metroError) {
//             console.log("metroError", metroError);
//             metroError.symbolicate(() => {
//                 resolve(metroError);
//             })
//         } else {
//             reject(new Error('Could not symbolicate error with Metro'));
//         }
//     });
// }

// TODO: Need to symbolicate the error with Metro using a universal LogBox implementation
// function useSymbolicatedMetroError(error: Error) {
//     return error;
//     // const [results, setResults] = React.useState(null);
//     // const isMounted = React.useRef(true);

//     // React.useEffect(() => {
//     //     symbolicateAsync(error).then((results) => {
//     //         if (isMounted.current) {
//     //             setResults(results);
//     //         }
//     //     }
//     //     ).catch((e) => {
//     //         console.error(e);
//     //     }
//     //     );
//     //     return () => {
//     //         isMounted.current = false;
//     //     }
//     // }, [error]);

//     // return results;
// }

export function Exception({ error, retry }: ErrorBoundaryProps) {
    return (
        // @ts-ignore
        <View accessibilityRole='main' style={[styles.container]}>
            <View style={{ maxWidth: 720, marginHorizontal: 'auto' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        {/* @ts-expect-error */}
                        <Text href="/" style={{ color: 'white' }}>
                            <ButtonContents title="Back" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
                        </Text>
                    </View>
                </View>

                <StackTrace error={error} />


            </View>
        </View>
    );
}

function StackTrace({ error }: { error: Error }) {
    return (
        <View style={{ marginVertical: 8, borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1, padding: 12, }}>
            <Text style={[styles.code, { color: 'white' }]}>
                {error.stack}
            </Text>
        </View>
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
