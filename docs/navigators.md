# Navigators

## Custom Navigator

When creating a basic layout like the ones found in most websites, you may want to create a custom navigator from scratch. This is easy. Just use `<Navigator.Content />`.

```tsx
import { Content } from "expo-router";

export default function App() {
  // Renders the currently selected screen:
  return (
    <>
      {/* A basic navigation bar for web. */}
      <nav>
        <a href="/">Home</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
      </nav>
      {/* Renders the selected child element. */}
      <Content />
    </>
  );
}
```
