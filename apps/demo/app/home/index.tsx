import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";

export default function Page() {
    const [state, setState] = useState(0);
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text
                    onPress={() => {
                        setState(state + 1);
                    }}
                    style={styles.title}
                >
                    Hello World
                </Text>
                <Text style={styles.subtitle}>{__filename}</Text>
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
