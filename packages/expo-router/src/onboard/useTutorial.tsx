import { useMemo, ComponentType } from "react";

import { RequireContext } from "../types";

function isFunctionOrReactComponent(
  Component: any
): Component is ComponentType {
  return (
    !!Component &&
    (typeof Component === "function" ||
      Component?.prototype?.isReactComponent ||
      Component.$$typeof === Symbol.for("react.forward_ref"))
  );
}

/** Returns the Tutorial component if there are no React components exported as default from any files in the provided context module. */
export function useTutorial(context: RequireContext) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const keys = useMemo(() => context.keys(), [context]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hasAnyValidComponent = useMemo(() => {
    if (process.env.EXPO_ROUTER_IMPORT_MODE === "sync") {
      for (const key of keys) {
        // NOTE(EvanBacon): This should only ever occur in development as it breaks lazily loading.
        const component = context(key)?.default;
        if (isFunctionOrReactComponent(component)) {
          return true;
        }
      }
      return false;
    }
    return !!context.keys().length;
    // return false;
  }, [keys]);

  if (hasAnyValidComponent) {
    return null;
  }

  return require("./Tutorial").Tutorial;
}
