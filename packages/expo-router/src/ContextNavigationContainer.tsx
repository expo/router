import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import React, { useMemo } from 'react';

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
    return (<NavigationContainer ref={ref} linking={linking} {...props} />)
})