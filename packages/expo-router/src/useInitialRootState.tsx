import { useLinkingContext } from "./link/useLinkingContext";
import { useServerState } from "./static/useServerState";

export function useInitialRootState() {
  // Node.js environments
  if (typeof window === "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useServerState();
  }

  // Web environments

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const linking = useLinkingContext();
  return linking.getStateFromPath(window.location.pathname, linking.config);
}
