import React from "react";

import getStateFromPath from "../fork/getStateFromPath";
import { useLinkingContext } from "../link/useLinkingContext";

function useServerStateNode() {
  // TODO: Expose this from React Navigation
  const ServerContext =
    // We use the value from `main` in the `package.json` since this
    // should only be accessed from processes that are running in Node.js and
    // conform to using `mainFields: ['main']` in their bundler config.
    require("@react-navigation/native/lib/commonjs/ServerContext").default;
  const getStateFromPath = useGetStateFromPath();
  const server = React.useContext<any>(ServerContext);
  const pathname = React.useMemo<string>(() => {
    const location = server?.location;
    if (!location) {
      throw new Error(
        `URL pathname to static render could not be found. This could mean that the ServerContext is mismatched between the runtime and server rendering code. This may also be a result of main package.json resolution working differently between the runtime and server rendering code.`
      );
    }
    return location.pathname + location.search;
  }, [server]);

  return getStateFromPath(pathname);
}

function useServerStateBrowser() {
  const getStateFromPath = useGetStateFromPath();
  const pathname = window.location.pathname + window.location.search;
  return getStateFromPath(pathname);
}

export function useServerState() {
  if (typeof document === "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useServerStateNode();
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useServerStateBrowser();
}

function useGetStateFromPath() {
  const linking = useLinkingContext();

  return React.useCallback(
    (state: Parameters<typeof getStateFromPath>[0]) => {
      return linking.getStateFromPath(state, linking.config);
    },
    [linking]
  );
}
