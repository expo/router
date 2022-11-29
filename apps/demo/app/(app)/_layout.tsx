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
  initialRouteName: "(home)",
  processChildren: (children) => {
    const node = children[0];
    return [
      cloneRoute(node, {
        name: "(home)",
        initialRouteName: "home",
      }),
      cloneRoute(node, {
        name: "(profile)",
        initialRouteName: "[user]/index",
      }),
      cloneRoute(node, {
        name: "(search)",
        initialRouteName: "explore/index",
      }),
    ];
  },
};

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(home)" options={{ title: "Home" }} />
      <Tabs.Screen name="(search)" options={{ title: "Search" }} />
      <Tabs.Screen
        name="(profile)"
        options={{ title: "Profile", href: "/baconbrix" }}
      />
    </Tabs>
  );
}
