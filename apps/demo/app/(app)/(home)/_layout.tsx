import { Stack, useHref } from "expo-router";
import { useRouteNode } from "expo-router/build/Route";

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
