import { StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="[beta]"
        options={{
          title: "Bacon!",
          headerShown: false,
        }} />
      <Tabs.Screen
        name="alpha"
        options={{
          title: "Hey!",
          tabBarIcon: () => {
            return <Text>Account</Text>;
          }
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Hey!",
          tabBarIcon: () => {
            return <Text>Account</Text>;
          }
        }}
      />
    </Tabs>
  );
}

export function Page2() {
  return (
    <Tabs
      order={["home", "[profile]"]}
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          const icons = {
            home: "home",
            "[profile]": "account",
          };
          return <Text>{icons[route.name]}</Text>;
        },
      })}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
