//  TODO: This is fragile and only works on web
// @ts-expect-error
import ServerContext from "@react-navigation/native/lib/module/ServerContext";
import React from "react";

import getStateFromPath from "../fork/getStateFromPath";
import { useLinkingContext } from "../link/useLinkingContext";

export function useServerState() {
  const getStateFromPath = useGetStateFromPath();

  const server = React.useContext<any>(ServerContext);

  const pathname = React.useMemo(() => {
    const location =
      server?.location ??
      (typeof window !== "undefined" ? window.location : undefined);

    return location ? location.pathname + location.search : undefined;
  }, [server]);

  const state = React.useMemo(() => {
    // TODO: useEffect is not called on the server, so we don't need these checks.
    return pathname ? getStateFromPath(pathname) : null;
  }, [pathname, getStateFromPath]);

  return typeof document === "undefined" ? state : null;
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
