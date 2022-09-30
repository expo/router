import React from "react";

import { Route, RouteNode, sortRoutes, useRoutes } from "./Route";
import { Screen } from "./primitives";
import { Try } from "./views/Try";

/**
 * @returns React Navigation screens for the route.
 */
export function useScreens(): React.ReactNode[] {
  const children = useRoutes();
  return React.useMemo(
    () => children.map((value) => routeToScreen(value)),
    [children]
  );
}

export type ScreenProps<
  TOptions extends Record<string, any> = Record<string, any>
> = {
  /** Name is required when used inside a Layout component. */
  name?: string;
  /**
   * Prevent the route from being accessed, effectively emulating a server [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) response.
   * If the route is accessed, the user will be redirected to the first sibling route that is not forbidden.
   * If all children are forbidden, the layout will render `null` as there are no children to render.
   */
  forbidden?: boolean;
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
    .map(({ name, forbidden, initialParams, options }) => {
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
        if (forbidden) {
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
  const children = useRoutes();
  const sorted = getSortedChildren(children, order);
  return React.useMemo(
    () => sorted.map((value) => routeToScreen(value.route, value.props)),
    [sorted]
  );
}

// TODO: Maybe there's a more React-y way to do this?
// Without this store, the process enters a recursive loop.
const qualifiedStore = new WeakMap<RouteNode, React.ComponentType<any>>();

/** Wrap the component with various enhancements and add access to child routes. */
function getQualifiedRouteComponent(value: RouteNode) {
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

      return <Route filename={value.contextKey}>{errorBoundary}</Route>;
    }
  );

  QualifiedRoute.displayName = `Route(${
    Component.displayName || Component.name || value.route
  })`;
  qualifiedStore.set(value, QualifiedRoute);
  return QualifiedRoute;
}

function routeToScreen(
  route: RouteNode,
  { options, ...props }: Partial<ScreenProps> = {}
) {
  const staticOptions = route.getExtras()?.getNavOptions;
  return (
    <Screen
      {...props}
      name={route.route}
      key={route.route}
      options={
        options
          ? (args) => {
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
            }
          : staticOptions
      }
      getComponent={() => getQualifiedRouteComponent(route)}
    />
  );
}
