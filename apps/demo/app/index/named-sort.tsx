import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNamedNavigationChildren } from 'expo-router';

const Nav = createBottomTabNavigator();

export default function App() {
    const { "[rest]": all, alpha, ...rest } = useNamedNavigationChildren();

    return <Nav.Navigator initialRouteName="beta" screenOptions={{
        headerShown: false
    }}>
        {alpha}
        {all}
        {Object.values(rest)}
    </Nav.Navigator>;
}
