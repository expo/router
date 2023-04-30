import React from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TargetedEvent,
} from "react-native";

import { Interaction } from "../../types";
import { createSignal } from "./signals";

export function useInteractionSignals(): Interaction {
  return React.useState(() => ({
    active: createSignal(false),
    hover: createSignal(false),
    focus: createSignal(false),
    layout: {
      width: createSignal<number>(0),
      height: createSignal<number>(0),
    },
  }))[0];
}

export function useInteractionHandlers(
  props: Record<string, any>,
  signals: Interaction,
  requiresLayout = false
) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  /**
   * Does setting a handler for each interaction cause any performance issues?
   * Would it be better to check the conditions on each style and selectively add them?
   *
   * onLayout is only used when there is a containerName, we can easily make that optional
   */
  return React.useMemo(() => {
    const handlers = {
      onPressIn(event: GestureResponderEvent) {
        propsRef.current.onPressIn?.(event);
        signals.active.set(true);
      },
      onPressOut(event: GestureResponderEvent) {
        propsRef.current.onPressOut?.(event);
        signals.active.set(false);
      },
      onHoverIn(event: MouseEvent) {
        propsRef.current.onHoverIn?.(event);
        signals.hover.set(true);
      },
      onHoverOut(event: MouseEvent) {
        propsRef.current.onHoverIn?.(event);
        signals.hover.set(false);
      },
      onFocus(event: NativeSyntheticEvent<TargetedEvent>) {
        propsRef.current.onFocus?.(event);
        signals.focus.set(true);
      },
      onBlur(event: NativeSyntheticEvent<TargetedEvent>) {
        propsRef.current.onBlur?.(event);
        signals.focus.set(false);
      },
    };

    if (requiresLayout) {
      return {
        ...handlers,
        onLayout(event: LayoutChangeEvent) {
          propsRef.current.onLayout?.(event);
          signals.layout.width.set(event.nativeEvent.layout.width);
          signals.layout.height.set(event.nativeEvent.layout.height);
        },
      };
    }

    return handlers;
  }, [requiresLayout]);
}
