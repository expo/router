import React, { useMemo } from 'react';

import { RoutesContext } from './context';
import { ContextNavigationContainer } from './ContextNavigationContainer';
import { getRoutes } from './getRoutes';
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
    const entryRouteId = useMemo(() => {
        const initialKeys = context.keys().filter((value) =>
            value.match(/^\.\/[^/]+\.(js|ts)x?$/)
        );
        const first = initialKeys[0]
        if (!initialKeys.length) {
            console.warn('No initial route found in the app directory.');
        }
        if (initialKeys.length > 1) {
            console.warn('Multiple initial routes found in the app directory.');
        }
        return first;
    }, [context]);

    const EntryComponent = useMemo(() => {
        const EntryComponent = interopDefault(context(entryRouteId)) ?? null;

        // if (!EntryComponent) {
        // TODO: Maybe dev only?
        const { Tutorial } = require('./Tutorial')
        return Tutorial;
        // }

        return EntryComponent;
    }, [entryRouteId]);

    return {
        id: entryRouteId,
        Component: EntryComponent,
    }
}

export function ContextNavigator({ context }: { context: RequireContext }) {
    const { id, Component } = useEntryModule(context);

    if (!id && Component) {
        return <Component />
    }

    return (
        <RoutesContextProvider context={context}>
            <CurrentRoute filename={id}>
                <ContextNavigationContainer>
                    <Component />
                </ContextNavigationContainer>
            </CurrentRoute>
        </RoutesContextProvider>
    );
}

function interopDefault(mod) {
    return mod?.default ?? mod;
}

