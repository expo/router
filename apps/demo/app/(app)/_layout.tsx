import { Tabs } from "expo-router";

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
  }: { name: string; initialRouteName: string }
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
    children: node.children,
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
  processChildren: (children) => {
    const node = children.find((c) => c.name === "(first)");
    console.log("node", node, children);
    if (node) {
      children.push(
        cloneRoute(node, {
          name: "(profile)",
          initialRouteName: "[user]/index",
        }),
        cloneRoute(node, {
          name: "(search)",
          initialRouteName: "explore/index",
        })
      );
    }
    return children;
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
