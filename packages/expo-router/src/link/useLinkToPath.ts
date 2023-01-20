import {
  getActionFromState,
  NavigationContainerRefContext,
} from "@react-navigation/core";
import * as Linking from "expo-linking";
import * as React from "react";

import { resolve } from "./path";
import { useLinkingContext } from "./useLinkingContext";

function isRemoteHref(href: string): boolean {
  return /:\/\//.test(href);
}

export function useLinkToPath() {
  const navigation = React.useContext(NavigationContainerRefContext);
  const linking = useLinkingContext();

  const linkTo = React.useCallback(
    (to: string, event?: string) => {
      if (isRemoteHref(to)) {
        Linking.openURL(to);
        return;
      }

      if (navigation == null) {
        throw new Error(
          "Couldn't find a navigation object. Is your component inside NavigationContainer?"
        );
      }

      if (to === ".." || to === "../") {
        navigation.goBack();
        return;
      }

      if (to.startsWith(".")) {
        let base = linking.getPathFromState?.(navigation.getRootState(), {
          ...linking.config,
          // @ts-expect-error: non-standard option
          preserveGroups: true,
        });

        if (base && !base.endsWith("/")) {
          base += "/..";
        }
        to = resolve(base, to);
      }

      const state = linking.getStateFromPath!(to, linking!.config);

      if (state) {
        const action = getActionFromState(state, linking?.config);

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
        throw new Error(
          "Failed to parse the path to a navigation state: " + to
        );
      }
    },
    [linking, navigation]
  );

  return linkTo;
}
