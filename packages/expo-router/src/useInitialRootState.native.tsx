import { useEffect, useState } from "react";
import URL from "url-parse";

import { State } from "./fork/getPathFromState";
import { useLinkingContext } from "./link/useLinkingContext";

function useResolvedPromise<T>(promise: Promise<T> | undefined) {
  const [resolved, setResolved] = useState<T | undefined>();

  useEffect(() => {
    if (promise) {
      promise.then(setResolved);
    }
  }, [promise]);

  return resolved;
}

export function useInitialRootState() {
  const linking = useLinkingContext();
  const url = useResolvedPromise(linking.getInitialURL() as Promise<string>);
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    if (url) {
      const parsed = URL(url);
      // TODO: Add hashes to the path
      const urlWithoutOrigin = parsed.pathname + parsed.query;

      setState(linking.getStateFromPath(urlWithoutOrigin, linking.config)!);
    }
  }, [url, linking]);

  return state;
}
