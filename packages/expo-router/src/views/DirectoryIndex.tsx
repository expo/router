import { Pressable, Text, StyleSheet, View } from "@bacons/react-views";
import { Code } from "@expo/html-elements";
import { useURL } from "expo-linking";
import React from "react";
import { Platform } from "react-native";
import { useRoutesContext } from "../context";
import { Link } from "./Link";
import { matchDynamicName } from "../matchers";
import { Navigator } from "../Navigator";
import { CurrentRouteContext } from "../routes";

// TODO: Parent directory button

export function DirectoryIndex() {
    const url = useURL();


    const ctx = React.useContext(CurrentRouteContext);

    const routes = ctx.siblings
        .filter(({ generated }) => !generated)
        .map((value) => {

            const href = matchDynamicName(value.route) ? 'random' : value.route;
            return {
                ...value,
                isDirectory: !value.component && !!value.children.length,
                // TODO: May need to adjust `contextKey` for nested directories to only include the last part of the path.
                name: value.contextKey ?? value.route,

                // TODO
                href: '/' + href,
            };
        });

    // TODO
    const canGoUp = !!ctx.parent

    console.log('parent', ctx.parent)
    console.log("routes:", routes);

    function renderChildren(
        children: { name: string; isDirectory: boolean; href: string }[],
        indent
    ) {
        if (!children) return null;

        return children.map((child, index) => {
            return (
                <FileItem
                    key={String(index + indent)}
                    isFile={!child.isDirectory}
                    name={child.name}
                    indent={indent}
                    href={child.href}
                />
            );
        });
    }

    return (
        <Navigator>
            <View style={{ paddingTop: 16, flex: 1, backgroundColor: "black" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "white" }}>Name</Text>
                    <Text style={{ color: "white" }}>Last edit</Text>
                    <Text style={{ color: "white" }}>Size</Text>
                </View>

                {canGoUp && (
                    <ListItem href={".."} icon={<UpIcon />} name="Parent directory" />
                )}
                {renderChildren(routes, 0)}

                <Text style={{ color: "white" }}>
                    Expo ({Platform.OS}) Server at {url}
                </Text>
            </View>
        </Navigator>
    );
}

function UpIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" color="white" viewBox="0 0 512 512">
            <title>Arrow Back</title>
            <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="48"
                d="M244 400L100 256l144-144M120 256h292"
            />
        </svg>
    );
}

function FileItem({ name, isFile, indent, href }) {
    return (
        <ListItem
            icon={isFile ? <FileIcon /> : <FolderIcon />}
            name={name}
            indent={indent}
            href={href}
        />
    );
}

function ListItem({ name, indent = 0, href, icon }) {
    return (
        <Link href={href}>
            <View
                style={[
                    {
                        cursor: "pointer",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 8,
                        paddingLeft: 24 + indent * 16,
                        paddingRight: 24,
                        transitionDuration: "200ms",
                    },
                ]}
            >
                <View style={{ width: 16, height: 16, marginRight: 8 }}>{icon}</View>

                <Code style={{ color: "white" }}>{name}</Code>
            </View>
        </Link>
    );
}

function FileIcon() {
    return (
        <svg fill="white" viewBox="0 0 16 16">
            <path d="M3,2 L13,2 L13,14 L3,14 L3,2 Z M9,2 L13,6 L13,2 L9,2 Z M9,6 L9,2 L8,2 L8,7 L13,7 L13,6 L9,6 Z"></path>
        </svg>
    );
}

function FolderOpenIcon() {
    return (
        <svg fill="white" viewBox="0 0 16 16">
            <g>
                <path d="M7.5,5 L2,5 L2,13 L7.75,13 L14,13 L14,4 L15,4 L15,14 L1,14 L1,4 L6.5,4 L5.5,5 L7.5,5 L7.5,4.5 L7.5,5 Z M14,4 L14,3 L7.5,3 L7.5,3.5 L7.5,3 L7,3.5 L7,2 L15,2 L15,4 L14,4 Z M6.5,4 L5,4 L7,2 L7,3.5 L6.5,4 Z"></path>
                <polygon points="0 7 13 7 14 14 1 14"></polygon>
            </g>
        </svg>
    );
}
function FolderIcon() {
    return (
        <svg fill="white" viewBox="0 0 16 16">
            <path d="M7.25,4 L7.5,4 L7.5,3 L7,3.5 L7,2 L15,2 L15,4 L7.25,4 Z M6.75,4 L5,4 L7,2 L7,3.5 L6.5,4 L6.75,4 Z M1,4 L15,4 L15,14 L1,14 L1,4 Z M7.5,3 L7.5,4 L14,4 L14,3 L7.5,3 Z"></path>
        </svg>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: Platform.select<string | number>({
            web: "4rem",
            default: 64,
        }),
        paddingBottom: 24,
        marginBottom: 24,
        // borderBottomColor: "rgba(255,255,255,0.4)",
        // borderBottomWidth: 1,
        textAlign: "center",
        fontWeight: "bold",
    },
    buttonText: {
        color: "black",
    },
    code: {
        fontFamily: Platform.select({
            default: "Courier",
            ios: "Courier New",
            android: "monospace",
        }),
        // fontWeight: '500',
    },
    subtitle: {
        color: "#BCC3CD",
        fontSize: Platform.select<string | number>({
            web: "2rem",
            default: 36,
        }),
        marginBottom: 24,
        textAlign: "center",
    },
    link: {
        position: "absolute",
        bottom: 24,
        left: 24,
        right: 24,
        color: "rgba(255,255,255,0.8)",
        fontSize: 14,
        textAlign: "center",
    },
});
