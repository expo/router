import React from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  NativeSyntheticEvent,
  TargetedEvent,
} from "react-native";

import { createSignal, Signal } from "./signals";

export type Interaction = {
  active: Signal<boolean>;
  hover: Signal<boolean>;
  focus: Signal<boolean>;
  layout: Signal<LayoutRectangle>;
};

const defaultLayout = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export function useInteractionSignals(): Interaction {
  return React.useState(() => ({
    active: createSignal(false),
    hover: createSignal(false),
    focus: createSignal(false),
    layout: createSignal<LayoutRectangle>(defaultLayout),
  }))[0];
}

export function useInteractionHandlers(
  props: Record<string, any>,
  signals: Interaction,
  containerName = ""
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

    if (containerName) {
      return {
        ...handlers,
        onLayout(event: LayoutChangeEvent) {
          propsRef.current.onLayout?.(event);
          signals.layout.set(event.nativeEvent.layout);
        },
      };
    }

    return handlers;
  }, [containerName]);
}
