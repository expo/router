import { Stack, Tabs } from "expo-router";

export const unstable_settings = {
  // initialRouteName: "feed",
  "[user]": {
    initialRouteName: "explore",
  },
};

export default function StackLayout({ segment }) {
  return <Stack />;
}
