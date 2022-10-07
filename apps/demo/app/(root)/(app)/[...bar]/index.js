import { Link, useLink } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function App({ navigation }) {
	const link = useLink();

	return (
		<View style={styles.container}>
			<Link href="../" style={{ fontSize: 24, fontWeight: "bold" }}>
				Dismiss
			</Link>
			<Text
				onPress={() => {

					link.replace('/');
				}}
			>
				Open settings dynamic
			</Text>
			<StatusBar barStyle="light-content" />
			{navigation.canGoBack() ? (
				<Text>Can go back</Text>
			) : (
				<Text>Can't go back</Text>
			)}
			<Link
				style={{ marginTop: 20, padding: 20, borderWidth: 2, borderColor: "black" }}
				href={"/orders"}
			>
				GoTo Orders
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	},
});
