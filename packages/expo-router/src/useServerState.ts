//  TODO: This is fragile and only works on web
import ServerContext from "@react-navigation/native/lib/module/ServerContext";
// import ServerContext from "@react-navigation/native/src/ServerContext";
import React from "react";

import getStateFromPath from "./fork/getStateFromPath";
import { useLinkingContext } from "./link/useLinkingContext";

export function useServerState() {
  const getStateFromPath = useGetStateFromPath();

  const server = React.useContext(ServerContext);

  return React.useMemo(() => {
    const location =
      server?.location ??
      (typeof window !== "undefined" ? window.location : undefined);

    const path = location ? location.pathname + location.search : undefined;

    if (path) {
      return getStateFromPath(path);
    }

    return null;
  }, [server, getStateFromPath]);
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
