// Fork of @react-navigation/native Link.tsx with `href` and `replace` support added and
// `to` / `action` support removed.
import { Text, TextProps } from "@bacons/react-views";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { GestureResponderEvent, Platform } from "react-native";

import { Href, resolveHref } from "./href";
import useLinkToPathProps from "./useLinkToPathProps";
import { useRouter } from "./useRouter";
import { useFocusEffect } from "../useFocusEffect";

type Props = {
  /** Path to route to. */
  href: Href;

  // TODO(EvanBacon): This may need to be extracted for React Native style support.
  /** Forward props to child component. Useful for custom buttons. */
  asChild?: boolean;

  /** Should replace the current route without adding to the history. */
  replace?: boolean;

  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
} & (Omit<TextProps, "href" | "hoverStyle"> & { children?: React.ReactNode });

/** Redirects to the href as soon as the component is mounted. */
export function Redirect({ href }: { href: Href }) {
  const router = useRouter();
  useFocusEffect(() => {
    router.replace(href);
  });
  return null;
}

/**
 * Component to render link to another route using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.href Absolute path to route (e.g. `/feeds/hot`).
 * @param props.replace Should replace the current route without adding to the history.
 * @param props.asChild Forward props to child component. Useful for custom buttons.
 * @param props.children Child elements to render the content.
 */
export const Link = React.forwardRef(ExpoRouterLink) as {
  /** Helper method to resolve an Href object into a string. */
  resolveHref: typeof resolveHref;
} & React.ForwardRefExoticComponent<Props>;

Link.resolveHref = resolveHref;

function ExpoRouterLink(
  {
    href,
    replace,
    // TODO: This does not prevent default on the anchor tag.
    asChild,
    ...rest
  }: Props,
  ref: React.ForwardedRef<Text>
) {
  const resolvedHref = React.useMemo(() => {
    if (href == null) {
      throw new Error("Link: href is required");
    }
    return resolveHref(href);
  }, [href]);

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
