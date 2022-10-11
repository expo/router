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
          tabBarButton: () => null,
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
          // Force the button to go to the user's profile
          tabBarButton: (props) => (
            <Link
              {...props}
              style={[props.style, { display: "flex" }]}
              href={`/${value.username}`}
            />
          ),
          title: "User",
        }}
      />
    </Tabs>
  );
}
