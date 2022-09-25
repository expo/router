---
title: Exports
sidebar_position: 5
---

The router supports the following exports per page:

- `default`: The default export is the React component that will be rendered for the page. The default export is required.
- `ErrorBoundary`: A [React error boundary](https://reactjs.org/docs/error-boundaries.html) for the page.

## ErrorBoundary

Error boundary is an optional a React component that wraps the route component. If the route component throws an error, the error boundary will catch it and render a fallback UI. This is useful for data fetching. The `ErrorBoundary` is passed the props `{ error: Error, retry: () => Promise<void> }`, where `error` is the caught error and `retry` is a function that will re-render the route component.

```js title=app/index.tsx
import { Text, View } from "react-native";
import { ErrorBoundaryProps } from "expo-router";

// highlight-next-line
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
    // highlight-next-line
    throw new Error("fake component error: " + __filename);
  }
  return <Text>Component</Text>;
}
```
