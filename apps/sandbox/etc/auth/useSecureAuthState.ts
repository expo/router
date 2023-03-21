import * as AuthSession from "expo-auth-session";
import * as React from "react";

import { useStorageState } from "./useStorageState";
import { useSafeState, UseStateHook } from "./utils";

export function useSecureAuthState(
  key: string
): UseStateHook<AuthSession.TokenResponse> {
  const [authState, setAuthState] = useStorageState(key);
  const [state, setState] = useSafeState<AuthSession.TokenResponse>();

  React.useEffect(() => {
    if (authState.value) {
      try {
        const parsed = new AuthSession.TokenResponse(
          JSON.parse(authState.value) as AuthSession.TokenResponseConfig
        );
        setState({ value: parsed });
      } catch {
        setState({
          error: new Error(
            `Failed to parse cached auth state: ${authState.value}`
          ),
        });
      }
    } else if (authState.error) {
      setState({ error: authState.error });
    } else {
      setState({ isLoading: authState.isLoading });
    }
  }, [authState]);

  const setSecureAuthState = React.useCallback(
    (value: AuthSession.TokenResponse | null) => {
      if (!value) {
        setAuthState(null);
      } else {
        setAuthState(JSON.stringify(authToJSON(value)));
      }
    },
    [setAuthState]
  );

  return [state, setSecureAuthState];
}

function authToJSON({
  accessToken,
  tokenType,
  expiresIn,
  refreshToken,
  scope,
  state,
  idToken,
  issuedAt,
}: AuthSession.TokenResponse) {
  return {
    accessToken,
    tokenType,
    expiresIn,
    refreshToken,
    scope,
    state,
    idToken,
    issuedAt,
  };
}
