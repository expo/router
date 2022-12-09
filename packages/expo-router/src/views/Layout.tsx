import {
  RouterFactory,
  StackRouter,
  useNavigationBuilder,
} from "@react-navigation/native";
import * as React from "react";

import { useContextKey } from "../Route";
import { useFilterScreenChildren } from "../layouts/withLayoutContext";
import { useSortedScreens } from "../useScreens";
import { Screen } from "./Screen";

// TODO: This might already exist upstream, maybe something like `useCurrentRender` ?
export const LayoutContext = React.createContext<{
  contextKey: string;
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
  router,
}: LayoutProps) {
  const contextKey = useContextKey();

  // Allows adding Screen components as children to configure routes.
  const { screens, children: otherChildren } = useFilterScreenChildren(
    children,
    { isCustomNavigator: true, contextKey }
  );

  const sorted = useSortedScreens(screens ?? []);

  if (!sorted.length) {
    console.warn(`Layout at "${contextKey}" has no children.`);
    return null;
  }

  return (
    <QualifiedLayout
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}
      screens={sorted}
      contextKey={contextKey}
      router={router}
    >
      {otherChildren}
    </QualifiedLayout>
  );
}

function QualifiedLayout({
  initialRouteName,
  screenOptions,
  children,
  screens,
  contextKey,
  router = StackRouter,
}: LayoutProps & { contextKey: string; screens: React.ReactNode[] }) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder(router, {
      // Used for getting the parent with navigation.getParent('/normalized/path')
      id: contextKey,
      children: screens,
      screenOptions,
      initialRouteName,
    });

  return (
    <LayoutContext.Provider
      value={{
        contextKey,
        state,
        navigation,
        descriptors,
        router,
      }}
    >
      <NavigationContent>{children}</NavigationContent>
    </LayoutContext.Provider>
  );
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
