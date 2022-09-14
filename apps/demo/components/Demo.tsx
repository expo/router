import { StyleSheet, Text, View } from 'react-native';

export default function Demo({ children, style }) {
    return (
        <View style={[styles.container, style]}>
            <Text
                style={{
                    fontWeight: "bold",
                    color: "white",
                    fontSize: 36,
                    textAlign: "center",
                }}
            >
                {children}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF968D",
        alignItems: "center",
        justifyContent: "center",
    },
});
