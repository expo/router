import { Text, View } from "@bacons/react-views";
import React from "react";
import { ActivityIndicator } from "react-native";

import {
  Route,
  RouteNode,
  sortRoutes,
  useContextKey,
  useRouteNode,
} from "./Route";
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

function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

function MissingRoute() {
  const route = useRouteNode();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 24 }}>
        No <Text style={{ color: "#E37DBB" }}>default export</Text> from route{" "}
        <Text style={{ color: "#F3F99A" }}>{route?.contextKey}</Text>
      </Text>
    </View>
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

  const Component = React.lazy(async () => {
    const res = value.getComponent();
    if (res instanceof Promise) {
      // TODO: Wrap with error boundary
      return res.then(({ ErrorBoundary, ...component }) => {
        if (ErrorBoundary) {
          return React.forwardRef(
            (props: { route: any; navigation: any }, ref: any) => {
              const children = React.createElement(component.default, {
                ...props,
                ref,
              });
              return <Try catch={ErrorBoundary}>{children}</Try>;
            }
          );
        }
        return { default: component.default || MissingRoute };
      });
    }
    return { default: res.default || MissingRoute };
  });

  // const { ErrorBoundary } = value.getExtras();

  const getLoadable = (props: any, ref: any) => (
    <React.Suspense fallback={<Loading />}>
      <Component
        {...{
          ...props,
          ref,
        }}
      />
    </React.Suspense>
  );

  const QualifiedRoute = React.forwardRef(
    (props: { route: any; navigation: any }, ref: any) => {
      const loadable = getLoadable(props, ref);

      return <Route node={value}>{loadable}</Route>;
    }
  );

  QualifiedRoute.displayName = `Route(${value.route})`;

  qualifiedStore.set(value, QualifiedRoute);
  return QualifiedRoute;
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
      options={(args) => {
        // Only eager load generated components
        const staticOptions = route.generated
          ? route.getExtras()?.getNavOptions
          : null;
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
