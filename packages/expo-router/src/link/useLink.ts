import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";

import { useLinkToPath } from "./useLinkToPath";
import { Href, resolveHref } from "./href";

// Wraps useLinkTo to provide an API which is similar to the Link component.
export function useLink(): {
  push: (href: Href) => void;
  replace: (href: Href) => void;
  back: () => void;
  parse: typeof resolveHref;
} {
  const linkTo = useLinkToPath();
  const navigation = useNavigation();

  return useMemo(
    () => ({
      push: (url: Href) => {
        const href = resolveHref(url);
        linkTo(href);
      },
      replace: (url: Href) => {
        const href = resolveHref(url);
        linkTo(href, "REPLACE");
      },
      back: () => navigation?.goBack(),
      parse: resolveHref,
      // TODO(EvanBacon): add `pathname`, `query`, maybe `reload`
      // TODO(EvanBacon): add `canGoBack` but maybe more like a `hasContext`
    }),
    [navigation, linkTo]
  );
}
