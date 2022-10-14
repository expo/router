import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";

import { RootContainer } from "../ContextNavigationContainer";

type GenericNavigation = NavigationProp<ReactNavigation.RootParamList>;

/** Returns a callback which is invoked when the navigation state has loaded. */
export function useLoadedNavigation() {
  const root = RootContainer.useRef();
  const navigation = useNavigation();
  const isMounted = useRef(true);
  const pending = useRef<((navigation: GenericNavigation) => void)[]>([]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const flush = useCallback(() => {
    if (isMounted.current) {
      const pendingCallbacks = pending.current;
      pending.current = [];
      pendingCallbacks.forEach((callback) => {
        callback(navigation);
      });
    }
  }, [navigation]);

  useEffect(() => {
    if (root) {
      flush();
    }
  }, [root, flush]);

  const push = useCallback(
    (fn: (navigation: GenericNavigation) => void) => {
      pending.current.push(fn);
      if (root) {
        flush();
      }
    },
    [flush, root]
  );

  return push;
}
