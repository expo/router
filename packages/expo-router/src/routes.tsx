import React, { ReactNode, useContext } from "react";
import { RoutesContext } from "./context";

import { Try } from "./views/Try";
import {
    matchDeepDynamicRouteName,
    matchDynamicName,
    matchFragmentName,
} from "./matchers";
import { Screen } from "./primitives";

const dev = process.env.NODE_ENV === "development";
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

export function createRouteNode(route: PickPartial<RouteNode, 'screenName' | 'dynamic' | 'children'>): RouteNode {
    return {
        screenName: getReactNavigationScreenName(route.route),
        children: [],
        dynamic: null,
        ...route,
    }
}

export const CurrentRouteContext = React.createContext<{
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
export function useRoutes(): RouteNode[] {
    const { filename, routes } = useContext(CurrentRouteContext);
    if (dev && !filename) {
        throw new Error("No filename found. This is likely a bug in expo-router.");
    }
    return routes;
}

/** Provides the matching routes and filename to the children. */
export function AutoRoute({
    filename,
    children,
}: {
    filename: string;
    children: ReactNode;
}) {
    const { children: routes } = useRoutesAtPath(filename);

    return (
        <CurrentRouteContext.Provider
            value={{ filename, routes }}
        >
            {children}
        </CurrentRouteContext.Provider>
    );
}

// `[page]` -> `:page`
// `page` -> `page`
export function convertDynamicRouteToReactNavigation(name: string) {
    if (matchDeepDynamicRouteName(name)) {
        return "*";
    }
    const dynamicName = matchDynamicName(name);

    if (dynamicName) {
        return `:${dynamicName}`;
    }

    if (name === "index" || matchFragmentName(name)) {
        return "";
    }

    return name;
}

export function getReactNavigationScreenName(name: string) {
    return matchDeepDynamicRouteName(name) || matchDynamicName(name) || name;
}

function useRoutesAtPath(filename: string): {
    children: RouteNode[];
    // siblings: RouteNode[];
    // parent: RouteNode | null;
} {
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
                    return {
                        // siblings, 
                        // parent ,
                        children: [],
                    };
                }

                // parent = current;
                // siblings = children;
                current = next;
                children = next?.children;
            }
        }

        return {
            // siblings, 
            // parent,
            children,
        };
    }, [normalName, keys]);

    return family;
}

function formatDynamicProps(
    path: string,
    dynamic: { name: string; deep: boolean }
): [string, string | string[]] {
    // Remove the first slash
    const sanitized = path.replace(/^\//, "");

    if (dynamic.deep) {
        return [dynamic.name, sanitized.split("/").map((value) => value || "/")]
    }
    return [dynamic.name, sanitized]
}

export function useScreens(): ReactNode[] {
    const children = useRoutes();
    return React.useMemo(() => children.map((value) => routeToScreen(value)), [children]);
}

export function useScreensRecord(): Record<string, ReactNode> {
    const children = useRoutes();
    return React.useMemo(() => Object.fromEntries(
        children.map((value) => [value.route, routeToScreen(value)])
    ), [children]);
}

function getQualifiedRouteComponent(value: RouteNode) {
    // console.log('getQualifiedRouteComponent:', value)
    const getDynamicProps = !value.dynamic
        ? () => ([])
        : (path?: string | null) => {
            if (path == null) {
                return [];
            }
            return formatDynamicProps(path, value.dynamic!);
        };


    const Component = value.getComponent();

    const { ErrorBoundary } = value.getExtras();

    const QualifiedRoute = React.forwardRef(
        (props: { route: any; navigation: any }, ref: any) => {
            // Surface dynamic name as props to the view
            const [dynamicKey, dynamicValue] = React.useMemo(
                () => getDynamicProps(props.route?.path),
                [props.route?.path]
            );

            const children = React.createElement(Component, {
                ...props,
                ref,
                [dynamicKey]: dynamicValue,
            });

            const errorBoundary = ErrorBoundary ? (
                <Try catch={ErrorBoundary}>{children}</Try>
            ) : (
                children
            );

            return (
                <AutoRoute filename={value.contextKey}>
                    {errorBoundary}
                </AutoRoute>
            );
        }
    );

    QualifiedRoute.displayName = `Route(${Component.displayName || Component.name || value.route})`;

    return QualifiedRoute;
}

function routeToScreen(route: RouteNode) {
    return (
        <Screen
            options={(props) => {
                const extras = route.getExtras?.();
                if (typeof extras?.getNavOptions === "function") {
                    return extras.getNavOptions(props);
                }
                return extras?.getNavOptions;
            }}
            name={route.screenName}
            key={route.route}
            component={getQualifiedRouteComponent(route)}
        />
    );
}

export function getNameFromFilePath(name: string): string {
    return name.replace(/(^.\/)|(\.[jt]sx?$)/g, "");
}
