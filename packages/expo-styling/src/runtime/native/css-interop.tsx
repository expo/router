import React, { ComponentType, useEffect, useReducer } from "react";

import { flattenStyle } from "./flattenStyle";
import { VariableContext, getGlobalStyles, styleMetaMap } from "./globals";
import { createComputation } from "./signals";
import { StyleSheet } from "./stylesheet";
import { useDynamicMemo } from "./utils";
import { useInteractionHandlers, useInteractionSignals } from "./interaction";

export type CSSInteropWrapperProps = {
  __component: ComponentType<any>;
  __styleKeys: string[];
} & Record<string, any>;

export function defaultCSSInterop(
  jsx: Function,
  type: ComponentType<any>,
  // Props are frozen in development so they need to be cloned
  { ...props }: any,
  key: string
) {
  props.__component = type;
  props.__styleKeys = ["style"];

  /**
   * In development, we need to wrap every component due to possible async style changes.
   * This wrapper only subscibes to StyleSheet.register, so it is not a huge performance hit.
   */
  if (__DEV__) {
    return jsx(DevOnlyCSSInteropWrapper, props, key);
  }

  classNameToStyle(props);

  /*
   * Most styles are static so the CSSInteropWrapper is not needed
   */
  if (!areStylesDynamic(props.style)) {
    return jsx(type, props, key);
  }

  return jsx(CSSInteropWrapper, props, key);
}

/**
 * During development, the user may be using a CSS Postprocess (like Tailwind).
 * React doesn't know when these updates will occur, so we need to subscribe to them.
 * As CSS is static in production, we only need this in development.
 */
const DevOnlyCSSInteropWrapper = React.forwardRef(
  function DevOnlyCSSInteropWrapper(
    { __component: Component, __styleKeys, ...props }: CSSInteropWrapperProps,
    ref
  ) {
    const [, render] = useReducer((acc) => acc + 1, 0);
    useEffect(() => StyleSheet.__subscribe(render), []);

    classNameToStyle(props);

    if (!areStylesDynamic(props.style)) {
      return <Component {...props} ref={ref} __skipCssInterop />;
    }

    return (
      <CSSInteropWrapper
        {...props}
        ref={ref}
        __component={Component}
        __styleKeys={__styleKeys}
        __skipCssInterop
      />
    );
  }
);

const CSSInteropWrapper = React.forwardRef(function CSSInteropWrapper(
  { __component: Component, __styleKeys, ...$props }: CSSInteropWrapperProps,
  ref
) {
  const { ...props } = $props;
  const [, rerender] = React.useReducer((acc) => acc + 1, 0);
  const inheritedVariables = React.useContext(VariableContext);

  const inlineVariables: Record<string, unknown>[] = [];
  const interaction = useInteractionSignals();

  /* eslint-disable react-hooks/rules-of-hooks -- __styleKeys is consistent an immutable */
  for (const key of __styleKeys) {
    /*
     * Create a computation that will flatten the style object. Any signals read while the computation
     * is running will be subscribed to.
     */
    const computation = React.useMemo(
      () =>
        createComputation(() =>
          flattenStyle($props[key], {
            interaction,
            variables: inheritedVariables,
          })
        ),
      [props[key], inheritedVariables]
    );
    useEffect(() => computation.subscribe(rerender), [computation]);
    props[key] = computation.snapshot();

    const meta = styleMetaMap.get(props[key]);

    if (meta) {
      if (meta.variables) {
        inlineVariables.push(meta.variables);
      }
    }
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  Object.assign(props, useInteractionHandlers($props, interaction));

  let children = <Component {...props} ref={ref} __skipCssInterop />;

  const variables = useDynamicMemo(
    () => Object.assign({}, inheritedVariables, ...inlineVariables),
    [inheritedVariables, ...inlineVariables]
  );

  if (inlineVariables.length > 0) {
    children = (
      <VariableContext.Provider value={variables}>
        {children}
      </VariableContext.Provider>
    );
  }

  return children;
});

function classNameToStyle(props: any) {
  if (typeof props.className === "string") {
    const classNameStyle = getGlobalStyles(props.className);

    props.style = Array.isArray(props.style)
      ? [...classNameStyle, ...props.style]
      : props.style
      ? [...classNameStyle, props.style]
      : classNameStyle;

    if (Array.isArray(props.style) && props.style.length <= 1) {
      props.style = props.style[0];
    }

    delete props.className;
  }
}

function areStylesDynamic(style: any) {
  if (!style) {
    return false;
  }

  // Some array styles are pre-tagged
  if (styleMetaMap.has(style)) {
    return true;
  }

  if (Array.isArray(style) && style.some(areStylesDynamic)) {
    // If this wasn't tagged before, tag it now so we don't have to
    // traget it again
    styleMetaMap.set(style, {});
    return true;
  }

  return false;
}
