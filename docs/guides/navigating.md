Ports https://reactnavigation.org/docs/navigating

```
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
│  ├─ details.js
```

```js
// app/(stack).js
import { Stack } from "expo-router";

export default function App() {
  return <Stack initialRouteName="home" />;
}
```

```js
// app/(stack)/home.js
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
// app/(stack)/details.js
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
