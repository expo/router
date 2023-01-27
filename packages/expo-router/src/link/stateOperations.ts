import { InitialState } from "@react-navigation/native";

import { ResultState } from "../fork/getStateFromPath";

// Get the last state for a given target state (generated from a path).
function findTopStateForTarget(state: ResultState) {
  let current: Partial<InitialState> | undefined = state;

  while (current?.routes?.[current?.routes?.length - 1].state != null) {
    current = current?.routes[current?.routes.length - 1].state;
  }

  return current;
}

/** Return the absolute last route to move to. */
export function findTopRouteForTarget(state: ResultState) {
  const nextState = findTopStateForTarget(state)!;
  // Ensure we get the last route to prevent returning the initial route.
  return nextState.routes?.[nextState.routes.length - 1]!;
}

/** @returns true if moving to a sibling inside the same navigator. */
export function isMovingToSiblingRoute(
  rootState: InitialState,
  targetState: ResultState
): boolean {
  let current: InitialState | undefined = targetState;
  let currentRoot: InitialState | undefined = rootState;

  while (current?.routes?.[current?.routes?.length - 1].state != null) {
    const nextRoute = current?.routes?.[current?.routes?.length - 1];

    if (
      // Has more
      nextRoute.state?.routes.length &&
      // No match
      !currentRoot
    ) {
      return false;
    }

    const absCurrent = currentRoot!.routes[currentRoot?.index ?? 0];

    if (absCurrent.name !== nextRoute.name) {
      return false;
    }

    currentRoot = currentRoot?.routes?.find(
      (route) => route.name === nextRoute.name
    )?.state;

    current = nextRoute.state;
  }

  return true;
}

// Given the root state and a target state from `getStateFromPath`,
// return the root state containing the highest target route matching the root state.
// This can be used to determine what type of navigator action should be used.
export function getQualifiedStateForTopOfTargetState(
  rootState: InitialState,
  targetState: ResultState
) {
  let current: InitialState | undefined = targetState;
  let currentRoot: InitialState | undefined = rootState;

  while (current?.routes?.[current?.routes?.length - 1].state != null) {
    const nextRoute = current?.routes?.[current?.routes?.length - 1];

    const nextCurrentRoot = currentRoot?.routes?.find(
      (route) => route.name === nextRoute.name
    )?.state;

    if (nextCurrentRoot == null) {
      return currentRoot;
      // Not sure what to do -- we're tracking against the assumption that
      // all routes in the target state are in the root state
      // currentRoot = undefined;
    } else {
      currentRoot = nextCurrentRoot;
    }

    current = nextRoute.state;
  }

  return currentRoot;
}
