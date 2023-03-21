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
  getEarliestMismatchedRoute,
  getQualifiedStateForTopOfTargetState,
  isMovingToSiblingRoute,
  NavigateAction,
} from "./stateOperations";
import { useLinkingContext } from "./useLinkingContext";

type NavStateParams = {
  params?: NavStateParams;
  path: string;
  initial: boolean;
  screen: string;
  state: unknown;
};

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
        // Here we have a navigation action to a nested screen, where we should ideally replace.
        // This request can only be fulfilled if the target is an initial route.
        // First, check if the action is fully initial routes.
        // Then find the nearest mismatched route in the existing state.
        // Finally, use the correct navigator-based action to replace the nested screens.
        // NOTE(EvanBacon): A future version of this will involve splitting the navigation request so we replace as much as possible, then push the remaining screens to fulfill the request.
        if (event === "REPLACE" && isAbsoluteInitialRoute(action)) {
          const earliest = getEarliestMismatchedRoute(
            rootState,
            action.payload
          );
          if (earliest) {
            if (earliest.type === "stack") {
              navigation.dispatch(
                StackActions.replace(earliest.name, earliest.params)
              );
            } else {
              navigation.dispatch(
                TabActions.jumpTo(earliest.name, earliest.params)
              );
            }
            return;
          } else {
            // This should never happen because moving to the same route would be handled earlier
            // in the sibling operations.
          }
        }

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

/** @returns `true` if the action is moving to the first screen of all the navigators in the action. */
export function isAbsoluteInitialRoute(
  action: ReturnType<typeof getActionFromState>
): action is NavigateAction {
  if (action?.type !== "NAVIGATE") {
    return false;
  }

  let next = action.payload.params;
  // iterate all child screens and bail out if any are not initial.
  while (next) {
    if (!isNavigationState(next)) {
      // Not sure when this would happen
      return false;
    }
    if (next.initial === true) {
      next = next.params;
      // return true;
    } else if (next.initial === false) {
      return false;
    }
  }

  return true;
}

function isNavigationState(obj: any): obj is NavStateParams {
  return "initial" in obj;
}
