import {
  CommonActions,
  getActionFromState,
  NavigationContainerRefContext,
  StackActions,
} from "@react-navigation/core";
import { TabActions } from "@react-navigation/routers";
import * as Linking from "expo-linking";
import * as React from "react";

import { resolve } from "./path";
import {
  findTopRouteForTarget,
  getQualifiedStateForTopOfTargetState,
  isMovingToSiblingRoute,
} from "./stateOperations";
import { useLinkingContext } from "./useLinkingContext";

function isRemoteHref(href: string): boolean {
  return /:\/\//.test(href);
}

export function useLinkToPath() {
  const navigation = React.useContext(NavigationContainerRefContext);
  const linking = useLinkingContext();

  const linkTo = React.useCallback(
    (href: string, event?: string) => {
      if (isRemoteHref(href)) {
        Linking.openURL(href);
        return;
      }

      if (navigation == null) {
        throw new Error(
          "Couldn't find a navigation object. Is your component inside NavigationContainer?"
        );
      }

      if (href === ".." || href === "../") {
        navigation.goBack();
        return;
      }

      if (href.startsWith(".")) {
        let base = linking.getPathFromState?.(navigation.getRootState(), {
          ...linking.config,
          // @ts-expect-error: non-standard option
          preserveGroups: true,
        });

        if (base && !base.endsWith("/")) {
          base += "/..";
        }
        href = resolve(base, href);
      }

      const state = linking.getStateFromPath!(href, linking!.config);

      if (!state) {
        console.error(
          "Could not generate a valid navigation state for the given path: " +
            href
        );
        return;
      }

      const rootState = navigation.getRootState();

      // Ensure simple operations are used when moving between siblings
      // in the same navigator. This ensures that the state is not reset.
      // TODO: We may need to apply this at a larger scale in the future.
      if (isMovingToSiblingRoute(rootState, state)) {
        // Can perform naive movements
        const knownOwnerState = getQualifiedStateForTopOfTargetState(
          rootState,
          state
        )!;
        const nextRoute = findTopRouteForTarget(state);

        if (knownOwnerState.type === "tab") {
          navigation.dispatch(
            TabActions.jumpTo(nextRoute.name, nextRoute.params)
          );
          return;
        } else {
          if (event === "REPLACE") {
            navigation.dispatch(
              StackActions.replace(nextRoute.name, nextRoute.params)
            );
          } else {
            // NOTE: Not sure if we should pop or push here...
            navigation.dispatch(
              CommonActions.navigate(nextRoute.name, nextRoute.params)
            );
          }
          return;
        }
      }

      // TODO: Advanced movements across multiple navigators

      const action = getActionFromState(state, linking!.config);
      if (action) {
        // Ignore the replace event here since replace across
        // navigators is not supported.
        navigation.dispatch(action);
      } else {
        navigation.reset(state);
      }
    },
    [linking, navigation]
  );

  return linkTo;
}
