import { Layout, Tabs } from "expo-router";
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
    <Tabs>
      <Layout.Screen
        name="(app)"
        options={{
          headerShown: false,
        }}
      />
      <Layout.Screen name="sign-in" />
    </Tabs>
  );
}
