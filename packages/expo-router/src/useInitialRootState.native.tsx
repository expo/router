import { useEffect, useState } from "react";

import { extractExpoPathFromURL } from "./fork/extractPathFromURL";
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
      // TODO: Add hashes to the path
      const urlWithoutOrigin = extractExpoPathFromURL(url);
      setState(linking.getStateFromPath(urlWithoutOrigin, linking.config)!);
    }
  }, [url, linking]);

  return state;
}
