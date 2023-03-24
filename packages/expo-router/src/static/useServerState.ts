import React from "react";

import getStateFromPath from "../fork/getStateFromPath";
import { useLinkingContext } from "../link/useLinkingContext";

// TODO: Expose this from React Navigation
const ServerContext =
  typeof window === "undefined"
    ? require("@react-navigation/native/src/ServerContext").default
    : require("@react-navigation/native/lib/module/ServerContext").default;

function useServerStateNode() {
  const getStateFromPath = useGetStateFromPath();
  const server = React.useContext<any>(ServerContext);
  const pathname = React.useMemo<string>(() => {
    const location = server?.location;
    if (!location) {
      throw new Error(
        `Static rendering server context is registered incorrectly and therefore the target pathname cannot be found.`
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
