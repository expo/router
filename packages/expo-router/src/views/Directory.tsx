import { Image, Pressable, Text, View } from '@bacons/react-views';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, ScrollView, StatusBar, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRoutesContext } from '../context';
import { matchFragmentName } from '../matchers';
import { RouteNode } from '../routes';
import { Link } from './Link';

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
            borderBottomColor: gray,
        },
    };
}

export function Directory() {
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

    const { top, bottom } = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    return (
        <View
            style={{
                backgroundColor: "black",
                flex: 1,
                alignItems: "stretch",
            }}
        >
            <StatusBar barStyle="light-content" />
            <View
                style={{
                    marginHorizontal: "auto",
                    flex: 1,
                    minWidth: Math.min(960, width * 0.9),
                    alignItems: "stretch",
                }}
            >
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={{
                        padding: 12,
                        flex: 1,
                        // paddingTop: top + 12,
                        paddingBottom: bottom + 12,
                        alignItems: "stretch",
                    }}
                    style={{ flex: 1 }}
                >
                    {Platform.OS === "android" && (
                        <Text
                            style={{
                                marginBottom: 12,
                                fontSize: 48,
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            Index
                        </Text>
                    )}
                    {routes.map((child) => (
                        <View
                            key={child.contextKey}
                            style={{
                                borderWidth: 1,
                                borderColor: gray,
                                borderRadius: 19,
                                marginBottom: 12,
                                overflow: "hidden",
                            }}
                        >
                            <FileItem route={child} />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const INDENT = 18;

const gray = `rgba(50,50,50,1)`;

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

    const href = React.useMemo(() => {
        return (
            "/" +
            [...parents, route.route]
                .map((v) => {
                    // groups and index must be erased
                    return !!matchFragmentName(v) || v === 'index' ? "" : v;
                })
                .filter(Boolean)
                .join("/")
        );
    }, [parents, route.route]);

    return (
        <>
            {/* @ts-expect-error: hoisted props aren't typed. */}
            <Link href={href} disabled={disabled} asChild>
                <Pressable>
                    {({ pressed, hovered }) => (
                        <View
                            style={[
                                {

                                    paddingHorizontal: INDENT,
                                    paddingLeft: INDENT + level * INDENT,
                                    paddingVertical: 16,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    transitionDuration: '100ms',
                                    backgroundColor: hovered ? "rgba(255,255,255,0.1)" : "transparent",
                                },
                                pressed && { backgroundColor: gray },
                                disabled && { opacity: 0.4 },
                            ]}
                        >
                            <View
                                style={{ flexDirection: "row", alignItems: "center" }}
                            >
                                {route.children.length ? <PkgIcon /> : <FileIcon />}
                                <Text style={{ color: "white", fontSize: 20, marginLeft: 12 }}>
                                    {route.contextKey}
                                </Text>
                            </View>

                            {!disabled && <ForwardIcon />}
                            {route.generated && <Text style={{ textAlign: 'right', color: 'white' }}>Virtual</Text>}
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
            style={{ width: 24, height: 24, resizeMode: "contain" }}
            source={require("expo-router/assets/file.png")}
        />
    );
}

function PkgIcon() {
    return (
        <Image
            style={{ width: 24, height: 24, resizeMode: "contain" }}
            source={require("expo-router/assets/pkg.png")}
        />
    );
}

function ForwardIcon() {
    return (
        <Image
            style={{ width: 24, height: 24, resizeMode: "contain" }}
            source={require("expo-router/assets/forward.png")}
        />
    );
}
