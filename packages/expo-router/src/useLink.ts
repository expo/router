import { useLinkTo, useNavigation } from "@react-navigation/native";
import { useMemo } from "react";

import { Href, resolveHref } from "./views/Link";

// Wraps useLinkTo to provide an API which is similar to the Link component.
export function useLink(): {
  push: (href: Href) => void;
  back: () => void;
  parse: typeof resolveHref;
} {
  const linkTo = useLinkTo();
  const navigation = useNavigation();

  return useMemo(
    () => ({
      push: (url: Href) => {
        const href = resolveHref(url);
        linkTo(href);
      },
      back: () => navigation?.goBack(),
      parse: resolveHref,
      // TODO(EvanBacon): add `replace`, `pathname`, `query`, maybe `reload`
      // TODO(EvanBacon): add `canGoBack` but maybe more like a `hasContext`
    }),
    [navigation, linkTo]
  );
}
