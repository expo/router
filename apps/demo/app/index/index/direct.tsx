import { StackNavigator } from 'expo-router';

export const getNavOptions = {
    title: "Messages 2",
};

export default function App() {
    return <StackNavigator screenOptions={{ headerShown: false }} ctx={__filename} />;
}
