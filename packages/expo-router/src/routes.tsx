import { useURL } from 'expo-linking';
import React, { forwardRef, ReactNode, useContext } from 'react';
import { RoutesContext } from './context';

import { AutoErrorBoundary } from './ErrorBoundary';
import { matchDeepDynamicRouteName, matchDynamicName, matchFragmentName } from './matchers';
import { Screen } from './primitives';

const dev = process.env.NODE_ENV === "development";


export type RouteNode<TComponent = React.ComponentType> = {
    /** nested routes */
    children: RouteNode<TComponent>[];
    /** React component */
    component: TComponent;
    /** Is the route a dynamic path */
    dynamic: boolean;
    /** All static exports from the file. */
    extras: Record<string, any>;
    /** `index`, `error-boundary`, etc. */
    route: string;
    /** require.context key, used for matching children. */
    contextKey: string;
    /** Added in-memory */
    generated?: boolean;
};

export const CurrentRouteContext = React.createContext<{
    filename: string | null;
    routes: RouteNode[];
    siblings: RouteNode[];
    parent: RouteNode | null;
}>({
    filename: null,
    routes: [],
    siblings: [],
    parent: null,
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
// export function useSelectedRoute() {
//     const url = useURL();
//     const routes = useRoutes();

//     const [route, setRoute] = React.useState<RouteNode | null>(null);

//     // TODO: This logic makes no sense
//     React.useEffect(() => {
//         if (!url) return;
//         const route = routes.find((route) => {
//             if (route.dynamic) {
//                 return url.startsWith(route.route);
//             }
//             return url === route.route;
//         });
//         setRoute(route ?? null);
//     }, [url, routes]);

//     const Component = routes[0].component;
//     return <Component />
// }

/** Provides the matching routes and filename to the children. */
export function CurrentRoute({
    filename,
    children,
}: {
    filename: string;
    children: ReactNode;
}) {
    const { children: routes, siblings, parent } = useRoutesAtPath(filename);

    return (
        <CurrentRouteContext.Provider value={{ filename, routes, siblings, parent }}>
            {children}
        </CurrentRouteContext.Provider>
    );
}

// `[page]` -> `:page`
// `page` -> `page`
export function convertDynamicRouteToReactNavigation(name: string) {

    if (matchDeepDynamicRouteName(name)) {
        return '*';
    }
    const dynamicName = matchDynamicName(name);

    if (dynamicName) {
        return `:${dynamicName}`;
    }
    return name;
}

export function getReactNavigationScreenName(name: string) {
    return matchDeepDynamicRouteName(name) || matchDynamicName(name) || name;
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
    const fragment = matchFragmentName(last);

    return {
        normalized,
        id,
        fragment,
        lastPathName: dynamicName ?? last,
        dynamic: !!dynamicName,
    };
}

function useRoutesAtPath(filename: string): { children: RouteNode[], siblings: RouteNode[], parent: RouteNode | null } {
    const info = React.useMemo(() => expandFilePath(filename), [filename]);
    const routes = useContext(RoutesContext);

    const family = React.useMemo(() => {
        let children: RouteNode[] = routes;
        let siblings: RouteNode[] = [];
        let current: RouteNode | null = null;
        let parent: RouteNode | null = null;

        // Skip root directory
        if (info.id) {
            // split and search
            const parts = info.id.split("/");
            for (const part of parts) {

                const next = children.find(({ route }) => route === part);

                if (!next?.children) {
                    return { siblings, children: [], parent };
                }

                parent = current;
                siblings = children;
                current = next;
                children = next?.children;
            }
        }

        return { siblings, children: children, parent };
    }, [info, routes]);

    const matchingRoutes = React.useMemo(() => {
        return family.children.filter(({ component }) => component);
    }, [family]);

    const parsedRoutes = React.useMemo(() => {
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

    return { children: parsedRoutes, siblings: family.siblings, parent: family.parent };
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
            name={getReactNavigationScreenName(value.route)}
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
                name={getReactNavigationScreenName(value.route)}
                key={value.route}
                component={value.component}
            />,
        ])
    );
}

export function getNameFromFilePath(name) {
    return name.replace(/(^.\/)|(\.[jt]sx?$)/g, "");
}
