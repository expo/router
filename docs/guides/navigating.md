Ports https://reactnavigation.org/docs/navigating

```
app/
├─ index.js
├─ index/
│  ├─ home.js
│  ├─ details.js
```

```js
// app/index.js
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigator } from "expo-router";

const Nav = createStackNavigator();

export default function App() {
  const Navigator = useNavigator(Nav);
  return <Navigator initialRouteName="home" />;
}
```

```js
// app/index/home.js
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("details")}
      />
    </View>
  );
}
```

```js
// app/index/details.js
import { View, Text } from "react-native";

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push("details")}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate("home")} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}
```
