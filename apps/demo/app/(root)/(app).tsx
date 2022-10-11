import { Link, Tabs } from "expo-router";
import { GoogleAuth } from "../../etc/auth/google";

export default function AppLayout() {
  const { value } = GoogleAuth.useUserInfo();
  return (
    <Tabs>
      {/* Prevent rendering the index button */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="[user]"
        options={{
          href: {
            pathname: "/[user]",
            query: {
              user: value?.username,
            },
          },
          title: "User",
        }}
      />
    </Tabs>
  );
}
