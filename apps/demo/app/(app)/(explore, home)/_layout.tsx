import { Stack } from "expo-router";

const firstRoute = {
  "(profile)": "[user]/index",
  "(explore)": "explore/index",
  "(home)": "home",
};

export default function StackLayout({ segment }) {
  return (
    <Stack>
      <Stack.Screen name={firstRoute[segment]} />
    </Stack>
  );
}
