import { Stack } from "expo-router";

// export const unstable_settings = {
//   initialRouteName: "home",
// };

const firstRoute = {
  "(profile)": "[user]/index",
  "(explore)": "explore/index",
  "(home)": "home",
};

export default function StackLayout({ segment }) {
  const first = firstRoute[segment];
  return <Stack />;
  // const first = firstRoute[segment];
  // return <Stack>{first && <Stack.Screen name={first} />}</Stack>;
}
