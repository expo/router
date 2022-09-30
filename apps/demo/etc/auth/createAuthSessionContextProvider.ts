import * as AuthSession from "expo-auth-session";
import * as React from "react";

import { createTokenResponseContextProvider } from "./TokenResponseContext";
import { useMounted, useSafeState } from "./utils";

type UseRequestResults<R extends AuthSession.AuthRequest> = [
  R | null,
  AuthSession.AuthSessionResult | null,
  (
    options?: AuthSession.AuthRequestPromptOptions | undefined
  ) => Promise<AuthSession.AuthSessionResult>
];

export function createAuthSessionContextProvider<
  R extends AuthSession.AuthRequest
>({
  storageKey,
  config,
  useRequest,
  discovery,
}: {
  storageKey: string;
  config: Partial<AuthSession.AuthRequestConfig>;
  useRequest: () => UseRequestResults<R>;
  discovery: AuthSession.DiscoveryDocument;
}) {
  const { Provider, useToken } = createTokenResponseContextProvider(storageKey);

  function useSignIn() {
    const [, setToken] = useToken();

    // NOTE(EvanBacon): Disabled this to create a fake authentication flow.

    // const [request, response, promptAsync] = useRequest();

    // React.useEffect(() => {
    //   if (response?.type === "success") {
    //     const { authentication } = response;
    //     if (authentication) setToken(authentication);
    //   }
    // }, [response]);

    return () => {
      setToken(
        new AuthSession.TokenResponse({
          accessToken: "xxxx",
        })
      );
    };
  }

  function useSignOut() {
    const [token, setToken] = useToken();

    return React.useCallback(async () => {
      if (!token.value?.accessToken) {
        return null;
      }
      let success = true;
      if (discovery.revocationEndpoint) {
        success = await AuthSession.revokeAsync(
          { ...config, token: token.value!.accessToken },
          discovery
        );
      }
      if (success) setToken(null);
      return success;
    }, [setToken, token.value?.accessToken, config]);
  }

  function useRefresh() {
    const [token, setToken] = useToken();

    return React.useCallback(async () => {
      if (!token.value?.accessToken) {
        return null;
      }
      const refreshed = await token.value.refreshAsync(
        {
          ...config,
          clientId: config.clientId!,
        },
        discovery
      );

      setToken(refreshed);

      return refreshed;
    }, [setToken, token.value?.accessToken, config]);
  }

  function useFreshToken() {
    const [token] = useToken();
    const refreshAsync = useRefresh();

    React.useEffect(() => {
      if (token.value?.shouldRefresh()) {
        refreshAsync();
      }
    }, [token.value, refreshAsync]);

    return token;
  }

  function useUserInfo<T extends Record<string, any>>() {
    const token = useFreshToken();
    return useFetchUserInfo<T>(token.value?.accessToken);
  }

  function useFetchUserInfo<T extends Record<string, any>>(
    accessToken?: string
  ): { value: T | null; error: Error | null } {
    const [state, setState] = useSafeState<T>();
    const isMounted = useMounted();

    React.useEffect(() => {
      if (!accessToken) {
        return;
      }
      AuthSession.fetchUserInfoAsync({ accessToken }, discovery)
        .then((value) => {
          // @ts-expect-error
          if (isMounted) setState({ value });
        })
        .catch((error) => {
          if (isMounted) setState({ error });
        });
    }, [accessToken]);

    return state;
  }

  return {
    Provider,
    useToken,
    useFreshToken,
    useUserInfo,
    useRefresh,
    useFetchUserInfo,
    useSignOut,
    useSignIn,
  };
}
