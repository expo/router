import { Children, Tabs } from "expo-router";
import { RouteNode } from "expo-router/build/Route";

function sortBy(node, order) {
  let children = [...node.children];
  return order
    .reduce((acc: any, name: string) => {
      const child = children.find((c: any) => c.name === name);
      if (child) {
        children = children.filter((c: any) => c.name !== name);
        acc.push(child);
      }
      return acc;
    }, [])
    .concat(children);
}

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
  return {
    ...node,
    children: !order?.length ? node.children : sortBy(node, order),
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
}

export const unstable_settings = {
  initialRouteName: "(first)",
  template: (node) => {
    if (node.name === "(first)") {
      const next = cloneRoute(node, {
        name: "(profile)",
        initialRouteName: "[user]/index",
        order: ["[user]/index"],
      });
      // console.log("template", node, next);
      return [
        node,
        cloneRoute(node, {
          name: "(search)",
          initialRouteName: "explore/index",
          order: ["explore/index"],
        }),
        next,
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
      <Tabs.Screen name="(profile)" />
      <Tabs.Screen name="(second)" options={{}} />
    </Tabs>
  );
}
