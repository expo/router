import { Link } from "@react-navigation/native";
import { Text, View } from "react-native";

export default function App({ navigation }) {
    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "blue",
                padding: 24,
                alignItems: "stretch",
            }}
        >
            <Link to={"/modal"} style={{ position: 'absolute', top: 8, left: 8 }}>Open Modal</Link>
            <Text onPress={() => {
                navigation.navigate('modal')
            }} style={{ position: 'absolute', bottom: 8, left: 8 }}>Open modal</Text>
        </View>
    );
}
