import Head from "expo-router/head";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function Layout() {
  return (
    <>
      {/* <Head /> */}
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon(props) {
              return (
                <Ionicons
                  {...props}
                  name={props.focused ? "ios-planet" : "ios-planet-outline"}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon(props) {
              return (
                <Ionicons
                  {...props}
                  name={props.focused ? "ios-search" : "ios-search-outline"}
                />
              );
            },
          }}
        />
      </Tabs>
    </>
  );
}
