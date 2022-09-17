import { useURL } from 'expo-linking';
import React, { useRef, useEffect, useMemo } from 'react';

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
    // const previousRoute = useRef(null)
    const url = useURL();
    const entryRoutes = useMemo(() => {
        const initialKeys = context.keys().filter((value) =>
            value.match(/^\.\/[^/]+\.(js|ts)x?$/)
        );
        return initialKeys;
    }, [context, url]);

    const entryRouteId = useMemo(() => entryRoutes[0], [entryRoutes]);

    const EntryComponent = useMemo(() => {
        if ((!entryRouteId || !interopDefault(context(entryRouteId))) && process.env.NODE_ENV === 'development') {
            const { Tutorial } = require('./onboard/Tutorial')
            return Tutorial;
        }
        return null;
    }, [entryRouteId]);


    // useEffect(() => {
    //     if (entryRoutes.length === 1 && !previousRoute.current) {
    //         if (typeof location !== 'undefined') {
    //             // window.location.pathname = '/'
    //         }
    //     }
    //     previousRoute.current = entryRouteId;
    // }, [entryRouteId, previousRoute.current]);

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
            <CurrentRoute filename="./">
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

