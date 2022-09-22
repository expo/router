---
title: Exports
sidebar_position: 5
---

# Page Exports

The router supports the following exports per page:

- `default`: The default export is the React component that will be rendered for the page. The default export is required.
- `ErrorBoundary`: A React component that wraps the page. If the page throws an error, the error boundary will catch it and render the error page. The `ErrorBoundary` is passed the props `{ error: Error, retry: () => Promise<void> }`, where `error` is the caught error and `retry` is a function that will rerender the component. Error boundaries are optional. Error boundaries are loaded with the page meaning they cannot be used to catch any errors that are thrown while loading the page asynchronously from a network request, to handle this, use a router at a lower level in the tree.
- `getNavOptions`: React Navigation-specific export for passing options to the navigator `<Screen />`. See [React Navigation docs](https://reactnavigation.org/docs/screen-options-resolution/#passing-options-to-a-screen) for more information. The `getNavOptions` function is optional.

```js title=app/index.tsx
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { ErrorBoundaryProps } from "expo-router";

export const getNavOptions = (): NativeStackNavigationOptions => ({
  presentation: "modal",
});

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{props.error.message}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </View>
  );
}

export default function App({ navigation }) {
  if (Math.random() > 0.5) {
    throw new Error("lol: " + __filename);
  }
  return (
    <View
      style={{
        margin: 24,
        borderRadius: 20,
        flex: 1,
        backgroundColor: "blue",
        padding: 24,
        alignItems: "stretch",
      }}
    >
      <Text
        style={{ position: "absolute", top: 8, left: 8 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        {__filename}
      </Text>
    </View>
  );
}
```

<details>
  <summary>Interoperability</summary>

The exports convention is somewhat similar to [Redwood cells](https://redwoodjs.com/docs/cells) and data loading in [Remix](https://remix.run/docs/en/v1/api/conventions#data-loading), Next.js, etc.

</details>
