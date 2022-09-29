// Fork of @react-navigation/native Link.tsx with `href` and `replace` support added and
// `to` / `action` support removed.
import { Text, TextProps } from "@bacons/react-views";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { GestureResponderEvent, Platform } from "react-native";

import useLinkToPathProps from "../fork/useLinkToPathProps";

export type Href = string | { pathname?: string; query?: Record<string, any> };

type Props = {
  /** Add a property which is familiar to  */
  href: Href;

  /** Forward props to child component. Useful for custom buttons. */
  asChild?: boolean;

  /** Should replace the current screen without adding to the history. */
  replace?: boolean;

  // to?: To<ParamList>;
  // action?: NavigationAction;
  target?: string;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
} & (TextProps & { children: React.ReactNode });

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.href Absolute path to screen (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
export const Link = React.forwardRef(ExpoRouterLink);

export const resolveHref = (
  href: { pathname?: string; query?: Record<string, any> } | string
): string => {
  if (typeof href === "string") {
    return href ?? "";
  }
  const path = href.pathname ?? "";
  if (!href?.query) {
    return path;
  }
  const { pathname, query } = createQualifiedPathname(path, { ...href.query });
  return pathname + (Object.keys(query).length ? `?${createQuery(query)}` : "");
};

function createQualifiedPathname(pathname: string, query: Record<string, any>) {
  for (const [key, value = ""] of Object.entries(query)) {
    const dynamicKey = `[${key}]`;
    const deepDynamicKey = `[...${key}]`;
    if (pathname.includes(dynamicKey)) {
      pathname = pathname.replace(
        dynamicKey,
        Array.isArray(value) ? value.join("/") : value
      );
    } else if (pathname.includes(deepDynamicKey)) {
      pathname = pathname.replace(
        deepDynamicKey,
        Array.isArray(value) ? value.join("/") : value
      );
    } else {
      continue;
    }

    delete query[key];
  }
  return { pathname, query };
}

function createQuery(query: Record<string, any>) {
  return Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join("&");
}

function ExpoRouterLink(
  { href, replace, asChild, ...rest }: Props,
  ref: React.ForwardedRef<Text>
) {
  // TODO: Auto use router's client-side event.
  const resolvedHref = React.useMemo(() => resolveHref(href), [href]);

  const props = useLinkToPathProps({ href: resolvedHref, replace });

  const onPress = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    if ("onPress" in rest) {
      rest.onPress?.(e);
    }
    props.onPress(e);
  };

  return React.createElement(
    // @ts-expect-error: slot is not type-safe
    asChild ? Slot : Text,
    {
      ref,
      ...props,
      ...rest,
      ...Platform.select({
        web: { onClick: onPress } as any,
        default: { onPress },
      }),
    }
  );
}
