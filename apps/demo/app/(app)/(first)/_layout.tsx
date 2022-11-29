import { Stack, useHref } from "expo-router";
import { useRouteNode } from "expo-router/build/Route";

// export const settings = {
//   initialRouteName: "index",
// };

const firstRoute = {
  "(profile)": "[user]/index",
  "(search)": "explore/index",
  "(first)": "home",
};

export default function StackLayout() {
  const { route } = useRouteNode();

  return (
    <Stack>
      <Stack.Screen name={firstRoute[route]} />
    </Stack>
  );
}
