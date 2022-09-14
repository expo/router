import { useURL } from 'expo-linking';
import React, { useMemo } from 'react';

import { RoutesContext } from './context';
import { ContextNavigationContainer } from './ContextNavigationContainer';
import { getRoutes } from './getRoutes';
import { NativeStackNavigator } from './navigation';
import { CurrentRoute } from './routes';

// @ts-expect-error: welp
type RequireContext = ReturnType<typeof require.context>;

function useContextModuleAsRoutes(context: RequireContext) {
    return useMemo(() => getRoutes(context), [context]);
}

function RoutesContextProvider({ context, children }: { context: RequireContext, children: React.ReactNode }) {
    const routes = useContextModuleAsRoutes(context);

    return (
        <RoutesContext.Provider value={routes}>
            {children}
        </RoutesContext.Provider>
    )
}

/** Return the initial component in the `app/` folder and the associated module ID. If no module is defined, return a tutorial component. */
function useEntryModule(context: RequireContext) {
    const url = useURL();
    const entryRouteId = useMemo(() => {
        const initialKeys = context.keys().filter((value) =>
            value.match(/^\.\/[^/]+\.(js|ts)x?$/)
        );
        const first = initialKeys[0]
        if (!initialKeys.length) {
            console.warn('No initial route found in the app directory.');
        }
        return first;
    }, [context, url]);

    const EntryComponent = useMemo(() => {
        if ((!entryRouteId || !interopDefault(context(entryRouteId))) && process.env.NODE_ENV === 'development') {
            const { Tutorial } = require('./Tutorial')
            return Tutorial;
        }
        return null;
    }, [entryRouteId]);

    return {
        id: entryRouteId,
        Component: EntryComponent,
    }
}

export function ContextNavigator({ context }: { context: RequireContext }) {
    const { Component } = useEntryModule(context);

    if (Component) {
        //  Tutorial
        return <Component />
    }

    return (
        <RoutesContextProvider context={context}>
            <CurrentRoute filename={"./"}>
                <ContextNavigationContainer>
                    {/* Using a switch navigator at the root to host all pages. */}
                    <NativeStackNavigator screenOptions={{ animation: 'none', headerShown: false }} />
                </ContextNavigationContainer>
            </CurrentRoute>
        </RoutesContextProvider>
    );
}

function interopDefault(mod) {
    return mod?.default ?? mod;
}

