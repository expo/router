import { Stack } from "expo-router";
import { useRouteNode } from "expo-router/build/Route";

export const unstable_settings = [
  {
    initialRouteName: "home",
  },
  {
    name: "(profile)",
    initialRouteName: "[user]/index",
  },
  {
    name: "(search)",
    initialRouteName: "explore/index",
  },
];

const firstRoute = {
  "(profile)": "[user]/index",
  "(search)": "explore/index",
  "(home)": "home",
};

export default function StackLayout() {
  const { route } = useRouteNode();

  return (
    <Stack>
      <Stack.Screen name={firstRoute[route]} />
    </Stack>
  );
}
