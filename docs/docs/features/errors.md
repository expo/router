---
title: Errors
sidebar_position: 4
---

![](/img/error-boundary.png)

Expo Router enables fine-tuned error handling to enable a more opinionated data loading strategy in the future. You can export a nested `ErrorBoundary` component from any route to intercept and format component-level errors using [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html):

```tsx title=app/home.tsx
import { View, Text } from 'react-native';

// highlight-next-line
export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{props.error.message}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </View>
  );
}

export default function Page() { ... }
```

When you export an `ErrorBoundary` the route will be wrapped with a React Error Boundary effectively:

```tsx title="virtual"
function Route({ ErrorBoundary, Component }) {
  return (
    <Try catch={ErrorBoundary}>
      <Component />
    </Try>
  );
}
```

When `ErrorBoundary` is not present, the error will be thrown to the nearest parent `ErrorBoundary`.

## API

### `ErrorBoundaryProps`

Each `ErrorBoundary` is passed the following props:

- `error`: _`Error`_ The error that was thrown.
- `retry`: _`() => Promise<void>`_ A function that will rerender the route component.

### `ErrorBoundary`

You can also use the default `ErrorBoundary` component for a quick UI:

```tsx title=app/home.tsx
// Re-export the default UI
export { ErrorBoundary } from "expo-router";
```

## TODO

- Metro errors need to be symbolicated in order to show the correct file name and line number on web.
- React Native LogBox needs to be presented less aggressively in order to develop with errors. Currently it shows for `console.error`s and `console.warn`s but it should ideally only show for uncaught errors.
