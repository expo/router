import { Children, Tabs } from "expo-router";
import { RouteNode } from "expo-router/build/Route";

function cloneRoute(
  node: any,
  {
    name: nextName,
    initialRouteName,
    order,
  }: { name: string; initialRouteName: string; order: string[] }
) {
  const prefix = node.parents.join("/");
  const toRemove = prefix + "/" + node.name + "/";
  console.log("toRemove", toRemove, prefix);
  const nextContextKey =
    "." +
    prefix +
    "/" +
    nextName +
    "/" +
    node.node.contextKey.replace("." + toRemove, "");
  const nextNormalName =
    prefix.substring(1) +
    "/" +
    nextName +
    "/" +
    node.node.normalizedName.replace(toRemove.substring(1), "");
  const third = {
    ...node,
    children: !order?.length
      ? node.children
      : order.reduce((acc: any, name: string) => {
          const child = node.children.find((c: any) => c.name === name);
          if (child) {
            acc.push(child);
          }
          return acc;
        }, []),
    name: nextName,
    node: {
      ...node.node,
      loadRoute() {
        const route = node.node.loadRoute();
        return {
          ...route,
          unstable_settings: {
            ...route.unstable_settings,
            initialRouteName,
          },
        };
      },
      normalizedName: nextNormalName,
      contextKey: nextContextKey,
    },
  };
  return third;
}

export const unstable_settings = {
  initialRouteName: "(second)",
  template: (node) => {
    console.log("template", node);
    if (node.name === "(second)") {
      return [
        node,
        cloneRoute(node, {
          name: "(third)",
          initialRouteName: "shared",
          order: ["shared", "index"],
        }),
      ];
    }
    return [node];
  },
};

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(first)" />
      <Tabs.Screen name="(third)" />
      <Tabs.Screen name="(second)" options={{}} />
    </Tabs>
  );
}
