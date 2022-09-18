import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { TabBarIcon } from '../../components/TabBarIcon';

export const getNavOptions: BottomTabNavigationOptions = {
    tabBarIcon: props => <TabBarIcon {...props} name="add-circle-outline" />,
}

// Learn more: TODO
export default function App() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Link href="/___index" style={{ fontSize: 36 }}>{__filename}</Link>
        </View >
    );
}