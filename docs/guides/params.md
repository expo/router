Ports https://reactnavigation.org/docs/params

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
import { View, Text } from "react-native";

export default function HomeScreen({ navigation, route }) {
  React.useEffect(() => {
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
    }
  }, [route.params?.post]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Text
        title="Go to Details"
        onPress={() => {
          /* 1. Navigate to the details route with query params */
          navigation.navigate("details", {
            itemId: 86,
            otherParam: "anything you want here",
          });
        }}
      >
        Go to Details
      </Text>
    </View>
  );
}
```

```js
// app/(stack)/details.js
import { View, Text } from "react-native";

function DetailsScreen({ navigation, route }) {
  const {
    // NOTE(EvanBacon): Prefer default value to initialParams -- https://reactnavigation.org/docs/params#initial-params
    itemId = 42,
    otherParam,
  } = route.params;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        onPress={() => {
          // https://reactnavigation.org/docs/params#updating-params
          navigation.setParams({
            query: "someText",
          });

          // https://reactnavigation.org/docs/params#passing-params-to-a-previous-screen
          // Pass and merge params back to home screen
          navigation.navigate({
            name: "home",
            params: { post: "random text" },
            merge: true,
          });
        }}
      >
        Details Screen
      </Text>
    </View>
  );
}
```

## Notes

- Prefer static route support (ex: `href="/foo/bar?some=data"`) to [passing-params-to-nested-navigators](https://reactnavigation.org/docs/params#passing-params-to-nested-navigators)
- Only serialized top level params are supported https://reactnavigation.org/docs/params#what-should-be-in-params
