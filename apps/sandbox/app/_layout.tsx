import { Text, View } from "react-native";
import TabbedSlot, { TabbedNavigator, TabLink } from "../nav/tab-slot";

export default function Layout() {
  return (
    <TabbedNavigator>
      <TabbedSlot />
      <TabBar />
    </TabbedNavigator>
  );
}

function TabBar() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 24,
      }}
    >
      <TabLink name="(index)">
        {(isFocused) => (
          <Text
            style={[
              {
                fontSize: 16,
                color: "black",
              },
              isFocused && {
                color: "blue",
              },
            ]}
          >
            Home
          </Text>
        )}
      </TabLink>
      <TabLink name="(user)" params={{ user: "bacon" }}>
        {(isFocused) => (
          <Text
            style={[
              {
                fontSize: 16,
                color: "black",
              },
              isFocused && {
                color: "blue",
              },
            ]}
          >
            Profile
          </Text>
        )}
      </TabLink>
    </View>
  );
}
