import { Layout } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { GoogleAuth } from "../etc/auth/google";

WebBrowser.maybeCompleteAuthSession();

export default function Root() {
  return (
    <GoogleAuth.Provider>
      <RootLayout />
    </GoogleAuth.Provider>
  );
}

function RootLayout() {
  const [token] = GoogleAuth.useToken();

  return (
    <Layout>
      <Layout.Screen
        name="(app)"
        // redirect={!token.isLoading && token.value === null}
        options={{
          headerShown: false,
        }}
      />
      <Layout.Screen
        name="sign-in"
        // redirect={!token.isLoading && token.value !== null}
      />
      <Layout.Children />
    </Layout>
  );
}
