import { useURL } from 'expo-linking';
import React, { useRef, useEffect, useMemo } from 'react';

import { RoutesContext } from './context';
import { ContextNavigationContainer } from './ContextNavigationContainer';
import { getRoutes } from './getRoutes';
import { NativeStack } from './navigation';
import { AutoRoute } from './routes';

// @ts-expect-error: welp
type ContextModule = ReturnType<typeof require.context>;

function useContextModuleAsRoutes(context: ContextModule) {
    return useMemo(() => getRoutes(context), [context]);
}

function RoutesContextProvider({ context, children }: { context: ContextModule, children: React.ReactNode }) {
    const routes = useContextModuleAsRoutes(context);

    return (
        <RoutesContext.Provider value={routes}>
            {children}
        </RoutesContext.Provider>
    )
}

function isFunctionOrReactComponent(Component: any): Component is React.ComponentType {
    return typeof Component === 'function' || Component.prototype?.isReactComponent;
}

/** Returns the Tutorial component if there are no React components exported as default from any files in the provided context module. */
function useTutorial(context: ContextModule) {
    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    const keys = useMemo(() => context.keys(), [context]);
    const hasAnyValidComponent = useMemo(() => {
        for (const key of keys) {
            const component = context(key)?.default;
            if (isFunctionOrReactComponent(component)) {
                return true;
            }
        }
        return false;
    }, [keys]);

    if (hasAnyValidComponent) {
        return null;
    }

    return require('./onboard/Tutorial').Tutorial
}

export function ContextNavigator({ context }: { context: ContextModule }) {
    const Tutorial = useTutorial(context);
    if (Tutorial) {
        return <Tutorial />
    }

    return (
        <RoutesContextProvider context={context}>
            <AutoRoute filename="./">
                <ContextNavigationContainer>
                    {/* Using a switch navigator at the root to host all pages. */}
                    <NativeStack screenOptions={{ animation: 'none', headerShown: false }} />
                </ContextNavigationContainer>
            </AutoRoute>
        </RoutesContextProvider>
    );
}

function interopDefault(mod) {
    return mod?.default ?? mod;
}

