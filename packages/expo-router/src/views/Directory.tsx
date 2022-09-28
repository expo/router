import { Image, Pressable, StyleSheet, Text, View } from "@bacons/react-views";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import React from "react";
import {
  ScrollView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RouteNode } from "../Route";
import { useRoutesContext } from "../context";
import { matchDeepDynamicRouteName, matchFragmentName } from "../matchers";
import { Link } from "./Link";

const INDENT = 18;

function useSortedRoutes() {
  const ctx = useRoutesContext();

  const routes = React.useMemo(
    () =>
      ctx
        .filter((route) => !route.internal)
        .sort((a, b) => {
          // Emulate vscode's sorting
          if (a.route < b.route) {
            return -1;
          }
          if (a.route > b.route) {
            return 1;
          }
          return 0;
        }),
    [ctx]
  );
  return routes;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "stretch",
  },
  main: {
    marginHorizontal: "auto",
    flex: 1,

    alignItems: "stretch",
  },
  scroll: {
    padding: 12,
    flex: 1,
    // paddingTop: top + 12,
    alignItems: "stretch",
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: "#323232",
    borderRadius: 19,
    marginBottom: 12,
    overflow: "hidden",
  },
  itemPressable: {
    paddingHorizontal: INDENT,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    transitionDuration: "100ms",
  },
  filename: { color: "white", fontSize: 20, marginLeft: 12 },
  virtual: { textAlign: "right", color: "white" },
  image: { width: 24, height: 24, resizeMode: "contain" },
});

export function getNavOptions(): NativeStackNavigationOptions {
  return {
    title: "Index",
    headerShown: true,
    presentation: "modal",
    animation: "default",
    headerLargeTitle: true,
    headerTitleStyle: {
      color: "white",
    },

    headerTintColor: "white",
    headerLargeTitleStyle: {
      color: "white",
    },
    headerStyle: {
      backgroundColor: "black",
      // @ts-expect-error: mistyped
      borderBottomColor: "#323232",
    },
  };
}

export function Directory() {
  const routes = useSortedRoutes();
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View
        style={[
          styles.main,
          {
            minWidth: Math.min(960, width * 0.9),
          },
        ]}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[
            styles.scroll,
            {
              paddingBottom: bottom + 12,
            },
          ]}
          style={{ flex: 1 }}
        >
          {routes.map((child) => (
            <View key={child.contextKey} style={styles.itemContainer}>
              <FileItem route={child} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function FileItem({
  route,
  level = 0,
  parents = [],
}: {
  route: RouteNode;
  level?: number;
  parents?: string[];
}) {
  const disabled = route.children.length > 0;

  const navigation = useNavigation();
  const href = React.useMemo(() => {
    return (
      "/" +
      [...parents, route.route]
        .map((v) => {
          // add an extra layer of entropy to the url for deep dynamic routes
          if (matchDeepDynamicRouteName(v)) {
            return v + "/" + Date.now();
          }
          // groups and index must be erased
          return !!matchFragmentName(v) || v === "index" ? "" : v;
        })
        .filter(Boolean)
        .join("/")
    );
  }, [parents, route.route]);

  return (
    <>
      <Link
        href={href}
        onPress={() => {
          if (Platform.OS !== "web") {
            // Ensure the modal pops
            navigation.goBack();
          }
        }}
        // @ts-expect-error: disabled not on type
        disabled={disabled}
        asChild
      >
        <Pressable>
          {({ pressed, hovered }) => (
            <View
              style={[
                styles.itemPressable,
                {
                  paddingLeft: INDENT + level * INDENT,
                  backgroundColor: hovered
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                },
                pressed && { backgroundColor: "#323232" },
                disabled && { opacity: 0.4 },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {route.children.length ? <PkgIcon /> : <FileIcon />}
                <Text style={styles.filename}>{route.contextKey}</Text>
              </View>

              {!disabled && <ForwardIcon />}
              {route.generated && <Text style={styles.virtual}>Virtual</Text>}
            </View>
          )}
        </Pressable>
      </Link>
      {route.children.map((child, index) => (
        <FileItem
          key={child.contextKey}
          route={child}
          parents={[...parents, route.route]}
          level={level + 1}
        />
      ))}
    </>
  );
}

function FileIcon() {
  return (
    <Image
      style={styles.image}
      source={require("expo-router/assets/file.png")}
    />
  );
}

function PkgIcon() {
  return (
    <Image
      style={styles.image}
      source={require("expo-router/assets/pkg.png")}
    />
  );
}

function ForwardIcon() {
  return (
    <Image
      style={styles.image}
      source={require("expo-router/assets/forward.png")}
    />
  );
}
