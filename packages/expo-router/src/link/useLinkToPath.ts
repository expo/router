import {
  getActionFromState,
  getStateFromPath,
  NavigationContainerRefContext,
} from "@react-navigation/core";
import { LinkingContext } from "@react-navigation/native";
import * as React from "react";
import { Linking } from "react-native";

export function useLinkToPath() {
  const navigation = React.useContext(NavigationContainerRefContext);
  const linking = React.useContext(LinkingContext);

  const linkTo = React.useCallback(
    (to: string, event?: string) => {
      if (navigation === undefined) {
        throw new Error(
          "Couldn't find a navigation object. Is your component inside NavigationContainer?"
        );
      }

      if (to === "../") {
        navigation.goBack();
        return;
      }

      if (!to.startsWith("/")) {
        if (/:\/\//.test(to)) {
          // Open external link
          Linking.openURL(to);
          return;
        } else {
          throw new Error(
            `The href must start with '/' (${to}) or be a fully qualified URL.`
          );
        }
      }

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
    [linking, navigation]
  );

  return linkTo;
}
