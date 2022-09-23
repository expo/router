import React from 'react';

import { Screen } from './primitives';
import { Route, RouteNode, useRoutes } from './Route';
import { Try } from './views/Try';

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

/**
 * @returns React Navigation screens for the route.
 */
export function useScreens(): React.ReactNode[] {
    const children = useRoutes();
    return React.useMemo(() => children.map((value) => routeToScreen(value)), [children]);
}

/** 
 * @returns React Navigation screens sorted by the `route` property.
 */
export function useScreensRecord(): Record<string, React.ReactNode> {
    const children = useRoutes();
    return React.useMemo(() => Object.fromEntries(
        children.map((value) => [value.route, routeToScreen(value)])
    ), [children]);
}

/** Wrap the component with various enhancements and add access to child routes. */
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
                <Route filename={value.contextKey}>
                    {errorBoundary}
                </Route>
            );
        }
    );

    QualifiedRoute.displayName = `Route(${Component.displayName || Component.name || value.route})`;

    return QualifiedRoute;
}

function routeToScreen(route: RouteNode) {
    return (
        <Screen
            name={route.screenName}
            key={route.route}
            component={getQualifiedRouteComponent(route)}
        />
    );
}
