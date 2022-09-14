import { Link } from "@react-navigation/native";
import { View } from "react-native";

export const getNavOptions = () => {
    return {
        title: "Profile",
    };
};

export default function App() {
    return (
        <View
            style={{
                margin: 24,
                borderRadius: 20,
                flex: 1,
                backgroundColor: "darkcyan",
                padding: 24,
                alignItems: "stretch",
            }}
        />
    );
}
