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
                flex: 1,
                flexDirection: "row",
                flexWrap: 'wrap'

            }}>
            <Link to={"/error-boundary"}>Go to</Link>
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />
        </View>
    );
}

function Square() {
    const size = 200;
    return (<View style={{ width: size, height: size, margin: 16, backgroundColor: 'gray' }} />)
}