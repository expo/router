import { Screen } from './primitives'
import { useURL } from "expo-linking";
import React, { createContext, forwardRef, ReactNode, useContext } from "react";

import { AutoErrorBoundary } from "./ErrorBoundary";

const dev = process.env.NODE_ENV === "development";

type RouteNode = {
    /** nested routes */
    children: RouteNode[];
    /** React component */
    component: React.ComponentType<any>;
    /** Is the route a dynamic path */
    dynamic: boolean;
    /** All static exports from the file. */
    extras: Record<string, any>;
    /** `index`, `error-boundary`, etc. */
    route: string;
};

export const CurrentRouteContext = React.createContext<{
    filename: string | null;
    routes: RouteNode[];
}>({
    filename: null,
    routes: [],
});

if (dev) {
    CurrentRouteContext.displayName = "Route";
}

export function useModuleRoute() {
    const { filename } = useContext(CurrentRouteContext);
    if (dev && !filename) {
        throw new Error("No filename found. This is likely a bug in expo-router.");
    }
    return filename;
}

/** Return all the routes for the current boundary. */
export function useRoutes() {
    const { filename, routes } = useContext(CurrentRouteContext);
    if (dev && !filename) {
        throw new Error("No filename found. This is likely a bug in expo-router.");
    }
    return routes;
}

/** Return the route that matches the current URL. */
export function useSelectedRoute() {
    const url = useURL();
    const routes = useRoutes();

    const [route, setRoute] = React.useState<RouteNode | null>(null);

    // TODO: This logic makes no sense
    React.useEffect(() => {
        if (!url) return;
        const route = routes.find((route) => {
            if (route.dynamic) {
                return url.startsWith(route.route);
            }
            return url === route.route;
        });
        setRoute(route ?? null);
    }, [url, routes]);

    return route;
}

/** Provides the matching routes and filename to the children. */
export function CurrentRoute({
    filename,
    children,
}: {
    filename: string;
    children: ReactNode;
}) {
    const routes = useRoutesAtPath(filename);

    return (
        <CurrentRouteContext.Provider value={{ filename, routes }}>
            {children}
        </CurrentRouteContext.Provider>
    );
}

// Routes context
export const RoutesContext = createContext<
    { route: string; children: any[] }[]
>([]);

export function matchDynamicName(name: string): string | undefined {
    return name.match(/^\[([^/]+)\]$/)?.[1];
}


// Match `(page)` -> `page`
export function matchGroupName(name: string): string | undefined {
    return name.match(/^\(([^/]+)\)$/)?.[1];
}

// `[page]` -> `:page`
// `page` -> `page`
export function convertDynamicRouteToReactNavigation(name: string) {
    const dynamicName = matchDynamicName(name);

    if (dynamicName) {
        return `:${dynamicName}`;
    }
    return name;
}

function expandFilePath(filePath: string) {
    // `./app/page.tsx` => `app/page`
    const normalized = getNameFromFilePath(filePath);
    // `app/page` => `page`
    const id = normalized;
    // const id = normalized.replace(/^app\//g, "");
    // `app/[page]` => `page`
    // `app/page` => `undefined`

    const last = id.split("/").pop();

    const dynamicName = matchDynamicName(last);
    const group = matchGroupName(last);

    return {
        normalized,
        id,
        group,
        lastPathName: dynamicName ?? last,
        dynamic: !!dynamicName,
    };
}

function useRoutesAtPath(filename: string): RouteNode[] {
    const info = React.useMemo(() => expandFilePath(filename), [filename]);
    // const name = getNameFromFilePath(filename).replace(/^app\//g, "");
    const routes = useContext(RoutesContext);

    const matchingRoutes = React.useMemo(() => {
        // split and search
        const parts = info.id.split("/");
        let current: any = routes;
        for (const part of parts) {
            current = current.find(({ route }) => route === part)?.children;
            if (!current) return [];
        }
        return current.filter(({ component }) => component);
    }, [info, routes]);

    return React.useMemo(() => {
        return matchingRoutes.map(({ component: Component, ...value }) => {
            const { ErrorBoundary } = value.extras;
            return {
                component: React.forwardRef((props, ref) => {
                    const children = <Component ref={ref} {...props} />;
                    if (ErrorBoundary) {
                        return (
                            <AutoErrorBoundary component={ErrorBoundary}>
                                {children}
                            </AutoErrorBoundary>
                        );
                    }
                    return <CurrentRoute filename={value.contextKey}>{children}</CurrentRoute>;
                }),
                ...value,
            };
        });
    }, [matchingRoutes]);
}

/** Get the children React nodes as an array. */
export function useChildren(): React.ReactNode[] {
    const children = useRoutes();
    return children.map((value) => <value.component key={value.route} />);
}

// TODO: Make this return only the selected component.
export function useChild() {
    const children = useRoutes();
    return children?.map((value) => <value.component key={value.route} />)[0];
}

/** Wrap a navigator and export with the children for a given. */
export function useNavigator(Nav) {
    const children = useNavigationChildren();
    if (!children?.length) return function EmptyNavigator() { };

    const Navigator = forwardRef((props, ref) => {
        return <Nav {...props} ref={ref} children={children} />;
    });

    return Navigator;
}

export function useNavigationChildren() {
    const children = useRoutes();
    return children.map((value) => (
        <Screen
            options={value.extras?.getNavOptions}
            name={convertDynamicRouteToReactNavigation(value.route)}
            key={value.route}
            component={value.component}
        />
    ));
}

export function useNamedNavigationChildren(): Record<string, ReactNode> {
    const children = useRoutes();
    return Object.fromEntries(
        children.map((value) => [
            value.route,
            <Screen
                options={value.extras?.getNavOptions}
                name={convertDynamicRouteToReactNavigation(value.route)}
                key={value.route}
                component={value.component}
            />,
        ])
    );
}

export function getNameFromFilePath(name) {
    return name.replace(/(^.\/)|(\.[jt]sx?$)/g, "");
}
