import * as React from "react";
import { GestureResponderEvent, Platform } from "react-native";

import { matchFragmentName } from "../matchers";
import { useLinkToPath } from "./useLinkToPath";

export default function useLinkToPathProps(props: {
  href: string;
  replace?: boolean;
}) {
  const linkTo = useLinkToPath();

  const onPress = (
    e?: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    let shouldHandle = false;

    if (Platform.OS !== "web" || !e) {
      shouldHandle = e ? !e.defaultPrevented : true;
    } else if (
      !e.defaultPrevented && // onPress prevented default
      // @ts-expect-error: these properties exist on web, but not in React Native
      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
      // @ts-expect-error: these properties exist on web, but not in React Native
      (e.button == null || e.button === 0) && // ignore everything but left clicks
      // @ts-expect-error: these properties exist on web, but not in React Native
      [undefined, null, "", "self"].includes(e.currentTarget?.target) // let browser handle "target=_blank" etc.
    ) {
      e.preventDefault();
      shouldHandle = true;
    }

    if (shouldHandle) {
      linkTo(props.href, props.replace ? "REPLACE" : undefined);
    }
  };

  return {
    href: props.href
      .split("/")
      .map((v) => (matchFragmentName(v) ? "" : v))
      .filter(Boolean)
      .join("/"),
    accessibilityRole: "link" as const,
    onPress,
  };
}
