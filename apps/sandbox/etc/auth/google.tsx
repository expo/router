import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

import { createAuthSessionContextProvider } from "./createAuthSessionContextProvider";

export function createGoogleAuthSessionContextProvider({
  config,
  isIdToken,
  redirectUriOptions,
}: {
  config: Partial<Google.GoogleAuthRequestConfig>;
  isIdToken?: boolean;
  redirectUriOptions?: Partial<AuthSession.AuthSessionRedirectUriOptions>;
}) {
  const useRequest = () => {
    const _useRequest = isIdToken
      ? Google.useIdTokenAuthRequest
      : Google.useAuthRequest;
    return _useRequest(config, redirectUriOptions);
  };
  return createAuthSessionContextProvider({
    storageKey: "AuthSession_Google",
    config,
    discovery: Google.discovery,
    useRequest,
  });
}

export const GoogleAuth = createGoogleAuthSessionContextProvider({
  config: {
    clientId: "xxx.apps.googleusercontent.com",
  },
});
