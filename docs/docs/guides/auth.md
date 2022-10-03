---
title: Authentication
---

It's common to restrict certain routes to users who are not authenticated. In `expo-router`, you can use the `redirect` prop on the `<Screen />` component to prevent access to a route.

Consider the following project:

```bash title="File System"
app/
  (root).js
  (root)/
    sign-in.js
    (app)/
      index.js
```

We can configure the `/(app)` routes to be redirect when the user is not authenticated:

```tsx title=app/(root).js
import { Layout } from "expo-router";

// Some generic authentication system...
import { AuthContext } from "../context/auth";

export default function Root() {
  return (
    // Setup the auth context and render our layout inside of it.
    <AuthContext.Provider>
      <RootLayout />
    </AuthContext.Provider>
  );
}

function RootLayout() {
  // Use some global auth context to control the route access.
  const auth = AuthContext.useToken();

  return (
    // Create a basic custom layout to render some children routes.
    <Layout>
      <Layout.Screen
        name="(app)"
        // When the auth is unavailable (no user signed in), restrict access to all the routes in the `(app)` directory.
        redirect={!auth}
      />
      <Layout.Screen
        name="sign-in"
        // When the auth is available (user is signed in), restrict access to the sign-in page.
        redirect={auth}
      />

      <Layout.Children />
    </Layout>
  );
}
```

Now if the authentication state changes globally, the user will be redirected to the appropriate route.

<!-- TODO: Guide on using redirects and per-screen behavior -->
