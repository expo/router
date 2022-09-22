import { useNavigation } from '@react-navigation/native';
import React from 'react';

/** Component for setting the current screen's options dynamically. */
export function LayoutOptions(props: any) {
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions(props);
    }, [navigation, props]);

    return null;
}