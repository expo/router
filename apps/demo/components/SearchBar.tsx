import React from "react";
import { View, Text } from "@bacons/react-views";
import { FlatList, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";

export function SearchBar() {
    const url = Linking.useURL();
    const [value, setValue] = React.useState('');

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 10,

                margin: 12,
            }}
        >
            <TextInput
                keyboardType="web-search"

                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Navigate"
                clearButtonMode="while-editing"
                defaultValue={url}
                onChangeText={(value) => {
                    setValue(value);
                }}
                value={value}
                onSubmitEditing={async () => {

                    openLinkAsync(value)

                }}
                style={{ flex: 1, padding: 12, fontSize: 18 }}
            />

        </View>
    );
}

function ClearButton() {

}

import { useRoutesContext } from 'expo-router/build/context'
import { matchDynamicName, matchCatchAllRouteName, matchOptionalCatchAllRouteName, matchFragmentName } from 'expo-router/build/matchers'
import { treeToReactNavigationLinkingRoutes } from "expo-router/build/getRoutes";

export function SearchView() {


    const ctx = useRoutesContext();
    const links = treeToReactNavigationLinkingRoutes(ctx);
    console.log('ctx', ctx, links)

    const possibleRoutes = ctx.reduce<{ key: string, route: string, fileName: string }[]>((acc, route) => {

        if (matchDynamicName(route.route) || matchCatchAllRouteName(route.route) || matchOptionalCatchAllRouteName(route.route)) {
            return acc;
        }

        acc.push({
            key: route.contextKey,
            route: matchFragmentName(route.route) ? '/' : route.route,
            fileName: route.contextKey
        });
        return acc;
    }, []);

    return (
        <View
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    style={{
                        maxWidth: 960,
                        flex: 1,
                        alignItems: "stretch",
                        flex: 1,
                        marginHorizontal: "auto",
                    }}
                >
                    <SearchBar />
                    <FlatList
                        data={possibleRoutes}
                        style={{ backgroundColor: 'rgba(255,255,255,0.5)', }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => {

                                openLinkAsync(item.route)
                            }}>
                                <Text style={{}} >{item.route}</Text>
                                <Text style={{ opacity: 0.6 }}>{item.fileName}</Text>
                            </TouchableOpacity>
                        )} />
                </View>
            </SafeAreaView>
        </View>
    );
}

async function openLinkAsync(value: string) {
    const url = Linking.createURL(value);
    console.log('OPEN:', url)
    if (await Linking.canOpenURL(url)) {
        Linking.openURL(url)
    }
}

