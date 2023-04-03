import { useRouter, useSegments } from "expo-router";
import React from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/core";

const AuthContext = React.createContext(null);

export function useAuth() {
  return React.useContext(AuthContext);
}

function useProtectedRoute(user) {
  const rootSegment = useSegments()[0];
  const router = useRouter();
  const nav = useNavigation();
  React.useEffect(() => {
    if (user === undefined) {
      return;
    }

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      rootSegment !== "(auth)"
    ) {
      // nav.dispatch(
      //   StackActions.replace("(auth)/sign-in", {
      //     // user: 'jane',
      //   })
      // );
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (user && rootSegment !== "(app)") {
      // Redirect away from the sign-in page.
      router.replace("/");
      // router.replace("/compose");
      // nav.dispatch(
      //   StackActions.replace("(app)", {
      //     // user: 'jane',
      //   })
      // );
    }
  }, [user, rootSegment]);
}

export function Provider(props) {
  const { getItem, setItem, removeItem } = useAsyncStorage("USER");
  const [user, setAuth] = React.useState(undefined);

  React.useEffect(() => {
    getItem().then((json) => {
      if (json) {
        setAuth(JSON.parse(json));
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
