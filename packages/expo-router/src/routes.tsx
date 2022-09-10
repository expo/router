import NavigationScreen from '@react-navigation/core/src/Screen';
import React, { createContext, forwardRef, ReactNode, useContext } from 'react';

import { AutoErrorBoundary } from './ErrorBoundary'
// Routes context
export const RoutesContext = createContext<
    { route: string; children: any[] }[]
>([]);

const ROOT_FOLDER = "app";

export function matchDynamicName(name: string): string | undefined {
    return name.match(/^\[([^/]+)\]$/)?.[1];
}

export function matchSlot(name: string): string | undefined {
    return name.match(/^@([^/]+)/)?.[1];
}

// Given `(..)foobar` return [`(..)`, `foobar`]
// Given `(..)(...)foobar` return [`(..)(...)`, `foobar`]
export function matchIntercepted(name: string): undefined | [string, string] {
    const match = name.match(/^((?:\(\.\.\.?\))+)([^/]+)/);
    if (!match?.[1]) return undefined;
    return [match[1], match[2]];
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
    const id = normalized.replace(new RegExp(`^${ROOT_FOLDER}/`, "g"), "");
    // const id = normalized.replace(/^app\//g, "");
    // `app/[page]` => `page`
    // `app/page` => `undefined`

    const last = id.split("/").pop();

    const dynamicName = matchDynamicName(last);
    const slot = matchSlot(last);
    if (!slot && last.startsWith("@")) {
        console.error(
            `Invalid slot name "${last}" at path "${filePath}". Slots must start with @ and contain only letters, numbers, and underscores.`
        );
    }

    const intercepted = matchIntercepted(last);
    if (intercepted && !intercepted[1]) {
        console.error(
            `Invalid intercepted route name "${last}" at path "${filePath}". Intercepted routes must start with '(..)' or '(...)' and contain only letters, numbers, and underscores.`
        );
    }

    return {
        normalized,
        id,
        slot,
        intercepted,
        lastPathName: dynamicName ?? last,
        dynamic: !!dynamicName,
    };
}

export function useRoutesAtPath(filename): { component: any, route: string, extras: Record<string, any> }[] {
    const info = expandFilePath(filename);
    // const name = getNameFromFilePath(filename).replace(/^app\//g, "");
    const routes = useContext(RoutesContext);
    // split and search
    const parts = info.id.split("/");
    let current: any = routes;
    for (const part of parts) {
        current = current.find(({ route }) => route === part)?.children;
        if (!current) return [];
    }

    const filtered = current.filter(({ component }) => component);

    return filtered.map(({ component: Component, ...value }) => {
        const { ErrorBoundary } = value.extras
        return {
            component: React.forwardRef((props, ref) => {
                const children = <Component ref={ref} {...props} />;
                if (ErrorBoundary) {
                    return (<AutoErrorBoundary component={ErrorBoundary}>{children}</AutoErrorBoundary>)
                }
                return children;
            }),
            ...value,
        }
    });
}

/** Get the children React nodes as an array. */
export function useChildren(filename?: string): React.ReactNode[] {
    const children = useRoutesAtPath(filename);
    return children.map((value) => <value.component key={value.route} />);
}

// TODO: Make this return only the selected component.
export function useChild(filename?: string) {
    const children = useRoutesAtPath(filename);
    return children?.map((value) => <value.component key={value.route} />)[0];
}

/** Wrap a navigator and export with the children for a given. */
export function useNavigator(Nav, filename?: string) {
    const children = useNavigationChildren(filename);
    if (!children?.length) return function EmptyNavigator() { };

    const Navigator = forwardRef((props, ref) => {
        return <Nav {...props} ref={ref} children={children} />;
    });

    return Navigator;
}

export function useNavigationChildren(filename?: string) {
    if (!filename) throw new Error("filename is required");
    const children = useRoutesAtPath(filename);
    return children
        .map((value) => (
            <NavigationScreen
                options={value.extras?.getNavOptions}
                name={convertDynamicRouteToReactNavigation(value.route)}
                key={value.route}
                component={value.component}
            />
        ));
}

export function useNamedNavigationChildren(
    filename?: string
): Record<string, ReactNode> {
    if (!filename) throw new Error("filename is required");
    const children = useRoutesAtPath(filename);
    return Object.fromEntries(
        children
            .map((value) => [
                value.route,
                <NavigationScreen
                    options={value.extras?.getNavOptions}
                    name={convertDynamicRouteToReactNavigation(value.route)}
                    key={value.route}
                    component={value.component}
                />,
            ])
    );
}

// TODO: useChild -- current route or null

export function getNameFromFilePath(name) {
    return name.replace(/(^.\/)|(\.[jt]sx?$)/g, "");
}
