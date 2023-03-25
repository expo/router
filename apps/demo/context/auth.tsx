import { useRouter, useSegments } from "expo-router";
import React from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const AuthContext = React.createContext(null);

export function useAuth() {
  return React.useContext(AuthContext);
}

function useProtectedRoute(user) {
  const rootSegment = useSegments()[0];
  const router = useRouter();
  React.useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      rootSegment !== "(auth)"
    ) {
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (user && rootSegment !== "(app)") {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, rootSegment]);
}

export function Provider(props) {
  const { getItem, setItem, removeItem } = useAsyncStorage("USER");
  const [user, setAuth] = React.useState(undefined);

  React.useEffect(() => {
    getItem().then((json) => {
      console.log("json", json);
      if (json != null) {
        setAuth(JSON.parse(json));
      } else {
        setAuth(null);
      }
    });
  }, []);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          setAuth({});
          setItem(JSON.stringify({}));
        },
        signOut: () => {
          setAuth(null);
          removeItem();
        },
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
