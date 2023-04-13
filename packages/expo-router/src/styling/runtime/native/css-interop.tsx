import React, { ComponentType, useEffect } from "react";

import { flattenStyle } from "./flattenStyle";
import { getGlobalStyles } from "./globals";
import { createComputation } from "./signals";

export function defaultCSSInterop(
  jsx: Function,
  type: any,
  _props: Record<string | number, unknown>,
  key: string
) {
  // Props are frozen in development, so we need to copy them
  const props = { ..._props };

  if (typeof props.className === "string") {
    const classNameStyle = getGlobalStyles(props.className);
    props.style = Array.isArray(props.style)
      ? [...classNameStyle, ...props.style]
      : props.style
      ? [...classNameStyle, props.style]
      : classNameStyle;

    delete props.className;
  }

  props.__component = type;
  props.__styleKeys = ["style"];

  // Wrap the component in a CSSInteropWrapper as we will be using custom hooks
  return jsx(CSSInteropWrapper, props, key);
}

export type CSSInteropWrapperProps = {
  __component: ComponentType<any>;
  __styleKeys: string[];
} & Record<string, any>;

export function CSSInteropWrapper({
  __component: Component,
  __styleKeys,
  ...props
}: CSSInteropWrapperProps) {
  for (const key of __styleKeys) {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- __styleKeys is constant
    props[key] = useComputedStyle(props[key]);
  }

  return <Component {...props} />;
}

/*
 * This hook takes a style object and returns a flattened version
 * The flattened version is created within a computation context, which creates
 * subscriptions to any encountered signals
 *
 * If a subscribed signal changes, the computation is invalidated and the hook will rerender
 */
function useComputedStyle(style: object) {
  const computation = React.useMemo(
    () => createComputation(() => flattenStyle(style)),
    [style]
  );

  const [, rerender] = React.useReducer((acc) => acc + 1, 0);
  useEffect(() => computation.subscribe(rerender), [computation]);

  return computation.snapshot();
}
