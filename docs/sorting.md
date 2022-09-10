# Sorting

Tab navigators and drawers require a system for sorting the order that screens appear in. This is a problem because the order of the screens is not defined in the code, but rather in the filesystem. Here are a couple possible solutions:

## Static exports

Each screen could sort a value indicating how it should be sorted:

```tsx
// Inside a page component
export const getNavOptions = {
  sort: 1,
};
```

- This would be a simple solution, but it would require the user to manually sort each screen. It's also not very intuitive as it elevates the appearance of certain UI elements like tab bar buttons into the screen.
- This API also doesn't support Fast Refresh since it sits outside of the component tree. Exporting a function that isn't a React component would also disable Fast Refresh for the respective screen export.

## Named children

The router API could provide a hook for returning named children instead of an array of children:

```tsx
import { createStackNavigator } from "@react-navigation/stack";
import { useNamedChildren } from "expo/router";

const Nav = createStackNavigator();

export default function App() {
  const Navigator = useNavigator(Nav);
  // Screen components named by route
  const { home, settings, "[profile]": profile } = useNamedChildren();
  return (
    <Navigator initialRouteName="home">
      {/* Add these in the order that they should appear in.*/}
      {home}
      {profile}
      {settings}
    </Navigator>
  );
}
```

This API is simple and easy but it doesn't allow for any customizations. This approach is the closest to implementing React Navigation as-is.
The issue with this approach is that you may forget to add a screen to the navigator. This is a problem because the screen won't be rendered at all and the errors will be confusing, this can partially be mitigated by using `Object.values()` with the remaining screens.

## Navigator API

The navigator could provide a more manual API for sorting, this is a bit nicer because it also removes the need for `getNavOptions`:

```tsx
import { TabNavigator } from "foobar";

export default function App() {
  return (
    <TabNavigator>
      {/* The outlet where the active view goes relative to the tab view. This allows for moving to a top bar. */}
      <TabNavigator.Screen />

      <TabNavigator.TabView>
        <TabNavigator.Tab to="/home">Home</TabNavigator.Tab>
        {/* This API would enable dynamic routes. */}
        <TabNavigator.Tab to="/evanbacon">Profile</TabNavigator.Tab>
        {/* This API would enable hidden routes. */}
        {/* <TabNavigator.Tab to="/settings">Settings</TabNavigator.Tab> */}
      </TabNavigator.TabView>
    </TabNavigator>
  );
}
```

- The drawback is that it's a bit more verbose, you must manually add UI to represent the routes (very similar to existing web frameworks).
- This approach has the added benefit of moving static customizations like the tab bar title out of the screen and into the navigator. This could also apply to icons. Most other changes like dynamic titles can be added dynamically from inside the screen to reflect changes that occur in the screen. If you consider the shared styles like header color moving into the navigator as well, this could be a solid alternative to the `getNavOptions` export.
