// Fork of @react-navigation/native Link.tsx with `href` and `replace` support added and
// `to` / `action` support removed.
import { Text, TextProps } from "@bacons/react-views";
import { Slot } from "@radix-ui/react-slot";
import { useFocusEffect } from "@react-navigation/native";
import * as React from "react";
import { GestureResponderEvent, Platform } from "react-native";

import { Href, resolveHref } from "./href";
import { useLink } from "./useLink";
import useLinkToPathProps from "./useLinkToPathProps";

type Props = {
  /** Add a property which is familiar to  */
  href: Href;

  // TODO(EvanBacon): This may need to be extracted for React Native style support.
  /** Forward props to child component. Useful for custom buttons. */
  asChild?: boolean;

  /** Should replace the current screen without adding to the history. */
  replace?: boolean;

  /** Redirects to the href as soon as the component is mounted. */
  onMount?: boolean;

  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
} & (TextProps & { children: React.ReactNode });

export function Redirect({ href }: { href: Href }) {
  const link = useLink();
  useFocusEffect(() => {
    link.replace(href);
  });
  return null;
}

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.href Absolute path to screen (e.g. `/feeds/hot`).
 * @param props.asChild Forward props to child component. Useful for custom buttons.
 * @param props.children Child elements to render the content.
 */
export const Link = React.forwardRef(ExpoRouterLink);

function ExpoRouterLink(
  { href, replace, onMount, asChild, ...rest }: Props,
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

  if (onMount) {
    return <Redirect href={href} />;
  }

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
