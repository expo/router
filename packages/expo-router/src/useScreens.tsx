import React from "react";

import { Route, RouteNode, sortRoutes, useRouteNode } from "./Route";
import { Screen } from "./primitives";
import { Try } from "./views/Try";

export type ScreenProps<
  TOptions extends Record<string, any> = Record<string, any>
> = {
  /** Name is required when used inside a Layout component. */
  name?: string;
  /**
   * Redirect to the nearest or provided sibling route.
   * If all children are redirect={true}, the layout will render `null` as there are no children to render.
   */
  redirect?: boolean | string;
  initialParams?: { [key: string]: any };
  options?: TOptions;
};

function getSortedChildren(
  children: RouteNode[],
  order?: ScreenProps[]
): { route: RouteNode; props: any }[] {
  if (!order?.length) {
    return children.sort(sortRoutes).map((route) => ({ route, props: {} }));
  }
  const entries = [...children];

  const ordered = order
    .map(({ name, redirect, initialParams, options }) => {
      if (!entries.length) {
        console.warn(
          `[Layout children]: Too many screens defined. Route "${name}" is extraneous.`
        );
        return null;
      }
      const matchIndex = entries.findIndex((child) => child.route === name);
      if (matchIndex === -1) {
        console.warn(
          `[Layout children]: No route named "${name}" exists in nested children:`,
          children.map(({ route }) => route)
        );
        return null;
      } else {
        // Get match and remove from entries
        const match = entries[matchIndex];
        entries.splice(matchIndex, 1);

        // Ensure to return null after removing from entries.
        if (redirect) {
          if (typeof redirect === "string") {
            throw new Error(
              `Redirecting to a specific route is not supported yet.`
            );
          }
          return null;
        }

        return { route: match, props: { initialParams, options } };
      }
    })
    .filter(Boolean) as {
    route: RouteNode;
    props: Partial<ScreenProps>;
  }[];

  // Add any remaining children
  ordered.push(
    ...entries.sort(sortRoutes).map((route) => ({ route, props: {} }))
  );

  return ordered;
}

/**
 * @returns React Navigation screens sorted by the `route` property.
 */
export function useSortedScreens(order: ScreenProps[]): React.ReactNode[] {
  const node = useRouteNode();

  const sorted = node?.children?.length
    ? getSortedChildren(node.children, order)
    : [];
  return React.useMemo(
    () => sorted.map((value) => routeToScreen(value.route, value.props)),
    [sorted]
  );
}

// TODO: Maybe there's a more React-y way to do this?
// Without this store, the process enters a recursive loop.
const qualifiedStore = new WeakMap<RouteNode, React.ComponentType<any>>();

/** Wrap the component with various enhancements and add access to child routes. */
export function getQualifiedRouteComponent(value: RouteNode) {
  if (qualifiedStore.has(value)) {
    return qualifiedStore.get(value)!;
  }

  const Component = value.getComponent();

  const { ErrorBoundary } = value.getExtras();

  const QualifiedRoute = React.forwardRef(
    (props: { route: any; navigation: any }, ref: any) => {
      // Surface dynamic name as props to the view
      const children = React.createElement(Component, {
        ...props,
        ref,
      });

      const errorBoundary = ErrorBoundary ? (
        <Try catch={ErrorBoundary}>{children}</Try>
      ) : (
        children
      );

      return <Route node={value}>{errorBoundary}</Route>;
    }
  );

  QualifiedRoute.displayName = `Route(${
    Component.displayName || Component.name || value.route
  })`;
  qualifiedStore.set(value, QualifiedRoute);
  return QualifiedRoute;
}

/** @returns a function which provides a screen id that matches the dynamic route name in params. */
export function createGetIdForRoute(
  route: Pick<RouteNode, "dynamic" | "route">
) {
  if (!route.dynamic) {
    return undefined;
  }
  const dynamicName = route.dynamic.name;
  const routeName = route.route;
  return ({ params }) => {
    // Params can be undefined when there are no params in the route.
    const preferredId = params?.[dynamicName];
    // If the route has a dynamic segment, use the matching parameter
    // as the screen id. This enables pushing a screen like `/[user]` multiple times
    // when the user is different.
    if (preferredId) {
      // Deep dynamic routes will return as an array, so we'll join them to create a
      // fully qualified string.
      return (
        (Array.isArray(preferredId) ? preferredId.join("/") : preferredId) ||
        routeName
      );
    }
    return routeName;
  };
}

function routeToScreen(
  route: RouteNode,
  { options, ...props }: Partial<ScreenProps> = {}
) {
  return (
    <Screen
      {...props}
      name={route.route}
      key={route.route}
      getId={createGetIdForRoute(route)}
      options={(args) => {
        const staticOptions = route.getExtras()?.getNavOptions;
        const staticResult =
          typeof staticOptions === "function"
            ? staticOptions(args)
            : staticOptions;
        const dynamicResult =
          typeof options === "function" ? options?.(args) : options;
        return {
          ...staticResult,
          ...dynamicResult,
        };
      }}
      getComponent={() => getQualifiedRouteComponent(route)}
    />
  );
}
