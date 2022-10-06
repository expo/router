import {
  getActionFromState,
  getStateFromPath,
  NavigationContainerRefContext,
} from "@react-navigation/core";
import { LinkingContext } from "@react-navigation/native";
import * as React from "react";
import { Linking } from "react-native";

import { useCurrentRoute } from "../useCurrentRoute";
import { normalizePath } from "./href";

export function useLinkToPath() {
  const navigation = React.useContext(NavigationContainerRefContext);
  const linking = React.useContext(LinkingContext);
  const current = useCurrentRoute();

  const linkTo = React.useCallback(
    (to: string, event?: string) => {
      if (current === null && event !== "REPLACE") return;
      if (navigation === undefined) {
        throw new Error(
          "Couldn't find a navigation object. Is your component inside NavigationContainer?"
        );
      }

      // if external -- go away ;(
      if (/:\/\//.test(to)) return Linking.openURL(to);

      // if relative, need append to current
      if (to.startsWith("../") || to.startsWith("./")) {
        to = current + "/" + to;
      }

      // normalize path, e.g. `/aaa/bbb/././//../ccc/` -> `/aaa/ccc/`
      to = normalizePath(to);

      const { options } = linking;

      const state = options?.getStateFromPath
        ? options.getStateFromPath(to, options.config)
        : getStateFromPath(to, options?.config);

      if (state) {
        const action = getActionFromState(state, options?.config);

        if (action !== undefined) {
          if (event) {
            // @ts-ignore
            action.type = event;
          }
          navigation.dispatch(action);
        } else {
          navigation.reset(state);
        }
      } else {
        throw new Error("Failed to parse the path to a navigation state.");
      }
    },
    [linking, navigation, current]
  );

  return linkTo;
}
