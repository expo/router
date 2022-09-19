import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import React, { useMemo, useCallback } from 'react';
import { useRoutesContext } from './context';
import { getLinkingConfig } from './getRoutes';

type NavigationContainerProps = React.ComponentProps<typeof NavigationContainer>;

function useLinkingConfig(): LinkingOptions<{}> {
    const routes = useRoutesContext()
    return useMemo(() => getLinkingConfig(routes), [routes]);
}

/** react-navigation `NavigationContainer` with automatic `linking` prop generated from the routes context. */
export const ContextNavigationContainer = React.forwardRef((props: NavigationContainerProps, ref: NavigationContainerProps['ref']) => {
    const linking = useLinkingConfig();
    console.log('linking', linking)

    const onReady = useCallback(() => {
        props.onReady?.();
        try {
            const { hideAsync } = require('expo-splash-screen') as typeof import('expo-splash-screen');
            // Automatically handle hiding the splash screen if expo-splash-screen is installed.
            hideAsync();
        } catch { }
    }, [props.onReady])

    return (<NavigationContainer ref={ref} linking={linking} {...props} onReady={onReady} />)
})