// Like <Slot /> from Expo Router but with stored tab history.
import { CommonActions } from "@react-navigation/native";
import { TabRouter } from "@react-navigation/routers";
import { Link, Navigator } from "expo-router";
import { Screen as RouterScreen } from "expo-router/src/views/Screen";
import * as React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Screen, ScreenContainer } from "react-native-screens";
// import {Link} from 'view/com/util/Link'

import { useLinkBuilder } from "./useLinkBuilder";

function useNavigatorContext() {
  const context = Navigator.useContext();

  if (process.env.NODE_ENV !== "production") {
    if (
      !(
        context.router.name === "TabRouter" ||
        context.router instanceof TabRouter
      )
    ) {
      throw new Error(
        "useTabbedSlot must be used inside a Navigator with a tab router: <Navigator route={TabRouter} />"
      );
    }
  }

  return context;
}

export function TabbedNavigator(props: React.ComponentProps<typeof Navigator>) {
  return <Navigator {...props} router={TabRouter} />;
}

export default function TabbedSlot({
  detachInactiveScreens = true,
  style,
}: {
  detachInactiveScreens?: boolean;
  style?: ViewStyle;
}) {
  const { state, descriptors } = useNavigatorContext();
  const focusedRouteKey = state.routes[state.index].key;
  const [loaded, setLoaded] = React.useState([focusedRouteKey]);

  if (!loaded.includes(focusedRouteKey)) {
    setLoaded([...loaded, focusedRouteKey]);
  }

  const { routes } = state;

  return (
    <ScreenContainer
      enabled={detachInactiveScreens}
      hasTwoStates
      style={styles.container}
    >
      {routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        const { lazy = true, unmountOnBlur } = descriptor.options;
        const isFocused = state.index === index;

        if (unmountOnBlur && !isFocused) {
          return null;
        }

        if (lazy && !loaded.includes(route.key) && !isFocused) {
          // Don't render a lazy screen if we've never navigated to it
          return null;
        }

        return (
          <Screen
            activityState={isFocused ? 2 : 0}
            key={route.key}
            style={[
              StyleSheet.absoluteFill,
              { overflow: "hidden", zIndex: isFocused ? 0 : -1 },
              style,
            ]}
            accessibilityElementsHidden={!isFocused}
            importantForAccessibility={
              isFocused ? "auto" : "no-hide-descendants"
            }
            enabled={detachInactiveScreens}
            freezeOnBlur={descriptor.options.freezeOnBlur}
          >
            {descriptor.render()}
          </Screen>
        );
      })}
    </ScreenContainer>
  );
}

function useContextRoute(name: string) {
  const context = Navigator.useContext();

  const { state, navigation, descriptors } = context;

  const current = state.routes.find((route, i) => {
    return route.name === name;
  });

  if (!current) {
    console.warn(
      `Could not find route with name: ${name}. Options: ${state.routes
        .map((r) => r.name)
        .join(", ")}`
    );
  }

  if (!current) {
    return null;
  }

  return {
    route: current,
    target: state.key,
    navigation,
    descriptor: descriptors[current.key],
  };
}

const TabLinkContext = React.createContext<boolean>(false);

export function TabLink({
  name,
  params,
  ...props
}: {
  name: string;
  params?: object;
  children:
    | ((focused: boolean) => React.ReactChild)
    | React.ComponentProps<typeof Link>["children"];
} & Omit<
  React.ComponentProps<typeof Link>,
  "href" | "onPress" | "onLongPress" | "children"
>) {
  const buildLink = useLinkBuilder();
  const ctxRoute = useContextRoute(name);
  const isActive = useIsTabSelected(name);

  if (!ctxRoute) {
    return null;
  }

  const { route, target, navigation } = ctxRoute;

  const onPress = (e) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isActive && !event.defaultPrevented) {
      e.preventDefault();
      navigation.dispatch({
        ...CommonActions.navigate({ name: route.name, params, merge: true }),
        target,
      });
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  const children =
    typeof props.children === "function"
      ? props.children(isActive)
      : props.children;

  return (
    <Link
      {...props}
      href={buildLink(name, params)}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <TabLinkContext.Provider value={isActive}>
        {children}
      </TabLinkContext.Provider>
    </Link>
  );
}

TabLink.useIsFocused = function useIsTabLinkFocused() {
  const isActive = React.useContext(TabLinkContext);
  return !!isActive;
};

TabbedNavigator.Slot = TabbedSlot;
TabbedNavigator.Link = TabLink;
TabbedNavigator.Screen = RouterScreen;
TabbedNavigator.useContext = useNavigatorContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});

export function useIsTabSelected(name: string): boolean {
  const { navigation } = TabbedNavigator.useContext();

  const state = navigation.getState();
  const current = state.routes.find((route, i) => state.index === i);

  return current?.name === name;
}
