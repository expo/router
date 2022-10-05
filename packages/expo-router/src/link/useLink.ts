import { useCallback } from "react";

import { Href, resolveHref } from "./href";
import { useLinkToPath } from "./useLinkToPath";
import { useLoadedNavigation } from "./useLoadedNavigation";
import { useRouteInfo } from "./useRouteInfo";

// Wraps useLinkTo to provide an API which is similar to the Link component.
export function useLink(): {
  push: (href: Href) => void;
  replace: (href: Href) => void;
  back: () => void;
  parse: typeof resolveHref;

  asPath: string;
  pathname: string;
  query: Record<string, string>;
} {
  const pending = useLoadedNavigation();
  const linkTo = useLinkToPath();

  const routeInfo = useRouteInfo();

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
    ...routeInfo,
    push,
    back,
    replace,
    parse: resolveHref,
    // TODO(EvanBacon): add `pathname`, `query`, maybe `reload`
    // TODO(EvanBacon): add `canGoBack` but maybe more like a `hasContext`
  };
}
