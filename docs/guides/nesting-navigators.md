Ports https://reactnavigation.org/docs/nesting-navigators

```
app/
├─ (stack).js
├─ (stack)/
│  ├─ home.js
│  ├─ home/
│    ├─ feed.js
│    ├─ messages.js
```

```js
// app/(stack).js
import { StackNavigator } from "expo-router";

export default StackNavigator;
```

This is nested in the `App` navigator, so it will be rendered as a stack.

```js
// app/(stack)/home.js
import { BottomTabNavigator } from "expo-router";

export default function Home() {
  return <BottomTabNavigator />;
}
```

```js
// app/(stack)/profile.js
import { Link } from "@react-navigation/native";

export default function Feed() {
  return <Link to="/home/messages">Navigate to nested route</Link>;
}
```

This is nested in the `Home` navigator, so it will be rendered as a tab.

```js
// app/(stack)/home/feed.js
import { View } from "react-native";

export default function Feed() {
  return <View />;
}
```

```js
// app/(stack)/home/messages.js
import { View } from "react-native";

export default function Messages() {
  return <View />;
}
```

## Notes
