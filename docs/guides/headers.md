Ports https://reactnavigation.org/docs/headers

```
app/
├─ index.js
├─ index/
│  ├─ home.js
│  ├─ details.js
```

```js
// app/(stack).js
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigator } from "expo-router";

const Nav = createStackNavigator();

export default function App() {
  const Navigator = useNavigator(Nav);
  return (
    <Navigator
      initialRouteName="home"
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      // Prefers using a `<Header />` component.
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  );
}
```

```js
// app/(stack)/home.js
import { View, Text, Image } from "react-native";

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require("@expo/snack-static/react-native-logo.png")}
    />
  );
}

// NOTE(EvanBacon): Does not fast refresh. Prefers exposing a `<Header />` component in the `app/index.js`.
export const getNavOptions = () => ({
  // https://reactnavigation.org/docs/headers#setting-the-header-title
  title: "My home",
  // https://reactnavigation.org/docs/headers#adjusting-header-styles
  headerStyle: {
    backgroundColor: "#f4511e",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
  headerTitle: (props) => <LogoTitle {...props} />,
});

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Text
        title="Go to Details"
        onPress={() => {
          navigation.navigate("details", {
            name: "Bacon",
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

export const getNavOptions = ({ route }) => ({
  // NOTE(EvanBacon): Prefer doing this in the component with `useLayoutEffect`.
  title: route.params.name,
});

function DetailsScreen({ navigation, route }) {
  // NOTE(EvanBacon): Preferred way to use route to update navigation options.
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.name,
    });
  }, [route, navigation]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        onPress={() => {
          navigation.setOptions({ title: "Updated!" });
        }}
      >
        Update the title
      </Text>
    </View>
  );
}
```

## Notes

- Prefers a `<Header />` component in the `app/index.js` file:

```tsx
// app/(stack).js
import {
  // NOTE(EvanBacon): New API
  Stack,
} from "@react-navigation/stack";

export default function App() {
  const route = useRoute();
  return (
    <Stack>
      {/* mode="screen" would clone this component into a wrapper for all screens. */}
      <Stack.Header tintColor="#fff" style={{ backgroundColor: "#f4511e" }}>
        <Header.Title
          style={{ fontWeight: "bold" }}
          {/* Could use context to populate some default values. */}
          title={route === "home" ? "Home" : "Details"}
        />
      </Stack.Header>

      {/* Auto populated. */}
      <Stack.Screens initial="home" />
    </Stack>
  );
}
```
