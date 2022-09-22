## Server-side routing on native

Native needs to work without a server in production for offline first, and for getting through app review. My previous approaches of [Auto nav Webpack](https://github.com/EvanBacon/expo-auto-navigation-webpack) and [Auto nav Metro](https://github.com/EvanBacon/expo-auto-navigation) "worked" in development but would need to be fairly different for production.

## Routes

The proposed file system structure is based on Remix's file system routing as it's the most proven variation of nested routes, and it's based on the highly accepted `react-router` API.

Where Remix and Next.js are both using `app` as the root directory, I'm proposing we stick with it. It even makes more sense in the context of React Native, as the app is an actual app :]

```
/app/index.js - universal root component. Think of this like the `pages/_document.js` in Next.js or the `app/route.js` in Remix.
```

- `app/route.ts` is the entry point for the routing system. It exports a `Route` object that contains the routes for the app.
- `app/routes` contains the routes for the app. Each route is a file that exports a default React component.
- `app/routes/$rest.tsx` is a catch-all route that is used to render any route that is not defined in `app/routes`.

- Dynamic routes

An alternative approach would be to use a magic file name like `/home/layout.js` instead of `/home.js` to define the layout for a route. This would allow for colocating components and other assets with the route. Using directories is also nice because you can implement other states like `/home/loading.js` or `/home/error.js` to be rendered at the same route, granted this could also be accomplished using a nested underscore route like `/home/_loading.js` for `/home.js`.

Given the [poor community reception](https://github.com/vercel/next.js/discussions/37136) to Next.js proposing this approach, I think it's best to avoid it for now.

### React Router by default

Use `react-router` to maintain the navigation state:

```tsx
export default function Home() {
  return (
    <>
      <Header />
      {/* Currently selected child route will be rendered. */}
      <Outlet />
    </>
  );
}
```

The Outlet would be populated by the global entry point of the app. We'd have to use `require.context` to dynamically import the routes and components and generate the `react-router` Routes on native, on web this could potentially be optimized to use a manifest of the routes.

---

In cases where we need to change the transitional properties of screens, we'd wrap the `Outlet` in a custom component:

> The idea here being that the `StackAnimation` component would add a transition context that the Outlet would look for and use to determine the transition properties. When the context is available it could indicate how many components need to be rendered at any given time.

```tsx
export default function Home() {
  return (
    <>
      <Header />
      <StackAnimation>
        {/* Currently selected child route will be rendered. */}
        <Outlet />
      </StackAnimation>
    </>
  );
}
```

To provide the boilerplate experience users currently get with `react-navigation`, we could provide some drop-in components that provide default styling:

```tsx
export default function Home() {
  return (
    <>
      <StackNavigator renderHeader={...} />
    </>
  );
}
```

The `Link` component could use static paths to move around like `/foo/bar`.

**Pros:**

- Implementation is optimized for web already.
- API is familiar to web developers.
- Fast to bundle as there is little recursive dependency discovery.
- Outlet model is easier to use than creating a custom React Navigation navigator. This makes custom navigation easier to implement, especially responsive layouts where the navigation view moves around the screen. Tabs, drawers, and basic stacks are all fairly simple to implement with this model.
- react-router already has a static API and supports things like multiple routes having the same name, unlike React Navigation.
- Possibly a con, but things like tab bars and drawers need to manually have each item added via components. We could maybe create boilerplate to automate this, but I personally like it since you could have routes that live that the same level but aren't added to the tab bar by default.

**Cons:**

- Not React Navigation. This would be a departure from the current API.
- Would take a while to reimplement certain native functionality. Outlet only renders the current route, so we'd need to implement a way to render multiple routes at once for stack navigation, and paging tabs.
- May be tricky to implement pure native transitions like `react-native-screens` using the Outlet model.
- The Outlet model is optimized for cases where the children are decoupled from the parent. This makes things like `headerMode: float` simple to implement, but radically different to `headerMode: screen` (where there is a new header on each screen). Given we currently swap between the two modes based on iOS/Android, this would be annoying to implement. This could maybe be accomplished using some magic to select the header and clone it using context.
- React router will probably need to be modified to support the strange history behavior of tab bars with nested navigators.

### Recursive context

Instead of using a global context, use local contexts to populate the `useChildren` hook. This would require a babel plugin to inject a hook in the file.

Use `react-navigation` to maintain the navigation state and render complex boilerplate components:

```tsx
// This is a shim
import { useNavigationProps } from "foobar";

const Stack = createStackNavigator();

export default function Home() {
  // Provides the children prop, populated with files in the current directory.
  const props = useNavigationProps(Stack);
  return <Stack.Navigator {...props} />;
}

// Babel plugin would remove `useNavigationProps` and replace it with the following, in the same file:

function useNavigationProps(Stack) {
  const files = require.context("./home", false);
  return {
    children: files.keys().map((key) => {
      const Component = files(key).default;
      return (
        <Stack.Screen
          key={key}
          name={key}
          component={Component}
          options={Component.getNavOptions}
        />
      );
    }),
  };
}
```

For things like Tab bar icons, a screen could export `getNavOptions` which returns the code to load ahead of time.

```ts
export default function Home() {
  return <Text>Home</Text>;
}

export const getNavOptions = () => ({
  tabBarIcon: require("./home-icon.png"),
});
```

This system has been rejected due to the approach requiring virtual modules or babel transforms to inject `require.context` calls into each file. This is a lot of magic and could lead to _more_ net bloat. Also virtual modules have a much slower bundling time as they "discover" dependencies recursively, meaning less parallel transpilation.
