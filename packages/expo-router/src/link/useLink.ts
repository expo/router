import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import {
  getNameFromFilePath,
  matchDeepDynamicRouteName,
  matchFragmentName,
} from "../matchers";
import { useContextKey } from "../Route";

import { Href, resolveHref } from "./href";
import { useLinkToPath } from "./useLinkToPath";
import * as Linking from "expo-linking";

function useCurrentUrl() {
  const ctx = useContextKey();
  const href = useMemo(() => {
    return getNameFromFilePath(ctx)
      .split("/")
      .map((v) => {
        // add an extra layer of entropy to the url for deep dynamic routes
        if (matchDeepDynamicRouteName(v)) {
          return v + "/" + Date.now();
        }
        // groups and index must be erased
        return !!matchFragmentName(v) || v === "index" ? "" : v;
      })
      .filter(Boolean)
      .join("/");
  }, [ctx]);

  return href;
}

// Wraps useLinkTo to provide an API which is similar to the Link component.
export function useLink(): {
  push: (href: Href) => void;
  replace: (href: Href) => void;
  back: () => void;
  parse: typeof resolveHref;
} {
  const linkTo = useLinkToPath();
  const navigation = useNavigation();
  const href = useCurrentUrl();

  return useMemo(
    () => ({
      href,
      location: Linking.createURL(href),
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
