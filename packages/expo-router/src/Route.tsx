import React, { ReactNode, useContext } from 'react';
import { getNameFromFilePath } from './matchers';
import { RoutesContext } from './context';

/** The list of input keys will become optional, everything else will remain the same. */
export type PickPartial<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

export type RouteNode = {
    /** nested routes */
    children: RouteNode[];
    /** Lazily get the React component */
    getComponent: () => React.ComponentType<any>;
    /** Is the route a dynamic path */
    dynamic: null | { name: string; deep: boolean };
    /** All static exports from the file. */
    getExtras: () => Record<string, any>;
    /** `index`, `error-boundary`, etc. */
    route: string;
    /** require.context key, used for matching children. */
    contextKey: string;
    /** Added in-memory */
    generated?: boolean;

    /** Internal screens like the directory or the auto 404 should be marked as internal. */
    internal?: boolean;

    /** React Navigation screen name. */
    screenName: string;
};

const CurrentRouteContext = React.createContext<{
    filename: string | null;
    routes: RouteNode[];
    // siblings: RouteNode[];
    // parent: RouteNode | null;
}>({
    filename: null,
    routes: [],
    // siblings: [],
    // parent: null,
});

if (process.env.NODE_ENV === "development") {
    CurrentRouteContext.displayName = "Route";
}

/** Return all the routes for the current boundary. */
export function useRoutes(): RouteNode[] {
    const { filename, routes } = useContext(CurrentRouteContext);
    if (process.env.NODE_ENV === "development") {
        if (!filename) {
            throw new Error("No filename found. This is likely a bug in expo-router.");
        }
    }
    return routes;
}

/** Provides the matching routes and filename to the children. */
export function Route({
    filename,
    children,
}: {
    filename: string;
    children: ReactNode;
}) {
    const routes = useRoutesAtPath(filename);

    return (
        <CurrentRouteContext.Provider
            value={{ filename, routes }}
        >
            {children}
        </CurrentRouteContext.Provider>
    );
}

function useRoutesAtPath(filename: string): RouteNode[] {
    const normalName = React.useMemo(() => getNameFromFilePath(filename), [filename]);
    const routes = useContext(RoutesContext);
    const keys = React.useMemo(() => routes.keys(), [routes]);

    const family = React.useMemo(() => {
        let children: RouteNode[] = routes;
        let current: RouteNode | null = null;
        // let siblings: RouteNode[] = [];
        // let parent: RouteNode | null = null;

        // Skip root directory
        if (normalName) {
            // split and search
            const parts = normalName.split("/");
            for (const part of parts) {
                const next = children.find(({ route }) => route === part);

                if (!next?.children) {
                    return [];
                }

                // parent = current;
                // siblings = children;
                current = next;
                children = next?.children;
            }
        }

        return children
    }, [normalName, keys]);

    return family;
}
