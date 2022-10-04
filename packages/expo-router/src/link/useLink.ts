import { useCallback } from "react";

import { Href, resolveHref } from "./href";
import { useLinkToPath } from "./useLinkToPath";
import { useLoadedNavigation } from "./useLoadedNavigation";

// Wraps useLinkTo to provide an API which is similar to the Link component.
export function useLink(): {
  push: (href: Href) => void;
  replace: (href: Href) => void;
  back: () => void;
  parse: typeof resolveHref;
} {
  const pending = useLoadedNavigation();
  const linkTo = useLinkToPath();

  const push = useCallback(
    (url: Href) => pending(() => linkTo(resolveHref(url))),
    [pending, linkTo]
  );

  const replace = useCallback(
    (url: Href) => pending(() => linkTo(resolveHref(url), "REPLACE")),
    [pending, linkTo]
  );

  const back = useCallback(
    () => pending((navigation) => navigation.goBack()),
    [pending]
  );

  return {
    push,
    back,
    replace,
    parse: resolveHref,
    // TODO(EvanBacon): add `pathname`, `query`, maybe `reload`
    // TODO(EvanBacon): add `canGoBack` but maybe more like a `hasContext`
  };
}
