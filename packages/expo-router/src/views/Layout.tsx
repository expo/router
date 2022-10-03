import {
  LinkingContext,
  RouterFactory,
  StackRouter,
  useNavigationBuilder,
} from "@react-navigation/native";
import * as React from "react";

import { useContextKey } from "../Route";
import getPathFromState from "../fork/getPathFromState";
import { useFilterScreenChildren } from "../layouts/withLayoutContext";
import { resolveHref } from "../link/href";
import { matchFragmentName } from "../matchers";
import { useSortedScreens } from "../useScreens";
import { Screen } from "./Screen";

// TODO: This might already exist upstream, maybe something like `useCurrentRender` ?
export const LayoutContext = React.createContext<{
  contextKey: string;
  /** Normalized path representing the selected route `/[id]?id=normal` -> `/normal` */
  pathname: string;
  /** Normalized string representing the selected state `/(group)/any/[id]` */
  statePath: string;
  state: any;
  navigation: any;
  descriptors: any;
  router: RouterFactory<any, any, any>;
} | null>(null);

if (process.env.NODE_ENV !== "production") {
  LayoutContext.displayName = "LayoutContext";
}

export type LayoutProps = {
  initialRouteName?: Parameters<
    typeof useNavigationBuilder
  >[1]["initialRouteName"];
  screenOptions?: Parameters<typeof useNavigationBuilder>[1]["screenOptions"];
  children?: Parameters<typeof useNavigationBuilder>[1]["children"];
  router?: Parameters<typeof useNavigationBuilder>[0];
};

/** An unstyled custom navigator. Good for basic web layouts */
export function Layout({
  initialRouteName,
  screenOptions,
  children,
  router = StackRouter,
}: LayoutProps) {
  const contextKey = useContextKey();

  // Allows adding Screen components as children to configure routes.
  const { screens, children: otherChildren } = useFilterScreenChildren(
    children,
    { isCustomNavigator: true }
  );

  const sorted = useSortedScreens(screens ?? []);
  const linking = React.useContext(LinkingContext);

  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder(router, {
      // Used for getting the parent with navigation.getParent('/normalized/path')
      id: contextKey,
      children: sorted,
      screenOptions,
      initialRouteName,
    });

  const statePath = linking.options?.getPathFromState
    ? linking.options.getPathFromState(state)
    : getPathFromState(state);

  return (
    <LayoutContext.Provider
      value={{
        pathname: pathnameFromStatePath(statePath),
        statePath: getNormalizedStatePath(statePath),
        contextKey,
        state,
        navigation,
        descriptors,
        router,
      }}
    >
      <NavigationContent>{otherChildren}</NavigationContent>
    </LayoutContext.Provider>
  );
}

function getNormalizedStatePath(statePath: string) {
  const pathname =
    "/" +
    (statePath
      .split("/")
      .map((value) => decodeURIComponent(value))
      .filter(Boolean)
      .join("/") || "");

  return pathname.split("?")![0];
}

function pathnameFromStatePath(statePath: string) {
  const pathname =
    "/" +
    (statePath
      .split("/")
      .map((value) => {
        const segment = decodeURIComponent(value);
        if (matchFragmentName(segment) != null || segment === "index") {
          return null;
        }
        return segment;
      })
      .filter(Boolean)
      .join("/") || "");

  const components = pathname.split("?");

  return resolveHref({
    pathname: components[0],
    // TODO: This is not efficient, we should generate based on the state instead
    // of converting to string then back to object
    query: parseQueryString(components[1] ?? ""),
  });
}

function parseQueryString(val: string) {
  if (!val) {
    return {};
  }
  const query = {};
  const a = val.split("&");
  for (let i = 0; i < a.length; i++) {
    const b = a[i].split("=");
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "");
  }
  return query;
}

export function useLayoutContext() {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a <Layout />");
  }
  return context;
}

export function useChild() {
  const context = useLayoutContext();

  const { state, descriptors } = context;

  const current = state.routes.find((route, i) => {
    return state.index === i;
  });

  if (!current) {
    return null;
  }

  return descriptors[current.key]?.render() ?? null;
}

/** Renders the currently selected content. */
export function Children(props: Omit<LayoutProps, "children">) {
  const contextKey = useContextKey();
  const context = React.useContext(LayoutContext);
  // Ensure the context is for the current contextKey
  if (context?.contextKey !== contextKey) {
    // Qualify the content and re-export.
    return (
      <Layout {...props}>
        <TrustedChildren />
      </Layout>
    );
  }

  return <TrustedChildren />;
}

export function TrustedChildren() {
  return useChild();
}

export function DefaultLayout() {
  return (
    <Layout>
      <TrustedChildren />
    </Layout>
  );
}

Layout.Children = Children;
Layout.useContext = useLayoutContext;

/** Used to configure route settings. */
Layout.Screen = Screen;
