import React, {
  ComponentType,
  useMemo,
  useEffect,
  useReducer,
  useState,
} from "react";

import { ContainerRuntime, InteropMeta, StyleMeta } from "../../types";
import { AnimationInterop } from "./animations";
import { flattenStyle } from "./flattenStyle";
import {
  ContainerContext,
  VariableContext,
  globalStyles,
  styleMetaMap,
} from "./globals";
import { useInteractionHandlers, useInteractionSignals } from "./interaction";
import { useComputation } from "./signals";
import { StyleSheet } from "./stylesheet";

type CSSInteropWrapperProps = {
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
  /*
   * Most styles are static so the CSSInteropWrapper is not needed
   */

  props.__component = type;
  props.__styleKeys = ["style"];

  /**
   * In development, we need to wrap every component due to possible async style changes.
   * This wrapper only subscibes to StyleSheet.register, so it is not a huge performance hit.
   */
  if (__DEV__) {
    return jsx(DevOnlyCSSInteropWrapper, props, key);
  }

  props = classNameToStyle(props);

  return areStylesDynamic(props.style)
    ? jsx(CSSInteropWrapper, props, key)
    : jsx(type, props, key);
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
    const [, render] = useReducer(rerenderReducer, 0);
    useEffect(() => StyleSheet.__subscribe(render), []);

    props = classNameToStyle(props);

    return areStylesDynamic(props.style) ? (
      <CSSInteropWrapper
        {...props}
        ref={ref}
        __component={Component}
        __styleKeys={__styleKeys}
        __skipCssInterop
      />
    ) : (
      <Component {...props} ref={ref} __skipCssInterop />
    );
  }
);

const CSSInteropWrapper = React.forwardRef(function CSSInteropWrapper(
  { __component: Component, __styleKeys, ...$props }: CSSInteropWrapperProps,
  ref
) {
  const [, rerender] = React.useReducer(rerenderReducer, 0);
  const inheritedVariables = React.useContext(VariableContext);
  const inheritedContainers = React.useContext(ContainerContext);
  const interaction = useInteractionSignals();

  /*
   * The purpose of interopMeta is to reduce how many operations are performed in the render function.
   * The meta is entirely derived by the computed styles, so we only need to calculate it when a style changes.
   *
   * Its ok to store normalised data here
   *
   * I'm not sure if using the derived state pattern is the best for performance
   * But apparently reading/writing to refs are not recommended?
   */
  const [interopMeta, setInteropMeta] = useState<InteropMeta>(initialMeta);
  let $interopMeta = interopMeta;

  for (const key of __styleKeys) {
    /*
     * Create a computation that will flatten the style object.
     * Any signals read while the computation is running will be subscribed to.
     *
     * useComputation handles the reactivity/memoization
     * flattenStyle handles converting the schema to a style object and collecting the metadata
     */

    /* eslint-disable react-hooks/rules-of-hooks -- __styleKeys is immutable */
    const style = useComputation(
      () => {
        return flattenStyle($props[key], {
          interaction,
          variables: inheritedVariables,
          containers: inheritedContainers,
        });
      },
      [$props[key], inheritedVariables, inheritedContainers],
      rerender
    );
    /* eslint-enable react-hooks/rules-of-hooks */

    /*
     * The style has changed so we need to update the interop meta
     * Instead of diffing what has changed we recalculate the entire meta.
     * We do this by updating styledPropsMeta and then flattening it later
     */
    if (interopMeta.styledProps[key] !== style) {
      const meta = styleMetaMap.get(style) ?? defaultMeta;

      $interopMeta = {
        ...$interopMeta,
        styledProps: { ...$interopMeta.styledProps, [key]: style },
        styledPropsMeta: {
          ...$interopMeta.styledPropsMeta,
          [key]: {
            animated: Boolean(meta.animations),
            transition: Boolean(meta.transition),
            requiresLayout: Boolean(meta.requiresLayout),
            variables: meta.variables,
            containers: meta.container?.names,
          },
        },
      };
    }
  }

  // This is where we flatten styledPropsMeta
  if ($interopMeta !== interopMeta) {
    let hasInlineVariables = false;
    let hasInlineContainers = false;
    let requiresLayout = false;

    const variables = {};
    const containers: Record<string, ContainerRuntime> = {};
    const animatedProps = new Set<string>();
    const transitionProps = new Set<string>();

    for (const key of __styleKeys) {
      const meta = $interopMeta.styledPropsMeta[key];

      Object.assign(variables, meta.variables);

      if (meta.variables) hasInlineVariables = true;
      if (meta.animated) animatedProps.add(key);
      if (meta.transition) transitionProps.add(key);
      if (meta.containers) {
        hasInlineContainers = true;
        const runtime: ContainerRuntime = {
          type: "normal",
          interaction,
          style: $interopMeta.styledProps[key],
        };

        containers.__default = runtime;
        for (const name of meta.containers) {
          containers[name] = runtime;
        }
      }

      requiresLayout ||= hasInlineContainers || meta.requiresLayout;
    }

    let animationInteropKey = undefined;
    if (animatedProps.size > 0 || transitionProps.size > 0) {
      animationInteropKey = [...animatedProps, ...transitionProps].join(":");
    }

    setInteropMeta({
      ...$interopMeta,
      variables,
      containers,
      animatedProps,
      transitionProps,
      requiresLayout,
      hasInlineVariables,
      hasInlineContainers,
      animationInteropKey,
    });
  }

  const variables = useMemo(
    () => Object.assign({}, inheritedVariables, interopMeta.variables),
    [inheritedVariables, interopMeta.variables]
  );

  const containers = useMemo(
    () => Object.assign({}, inheritedContainers, interopMeta.containers),
    [inheritedContainers, interopMeta.containers]
  );

  // This doesn't need to be memoized as it's values will be spread across the component
  const props: Record<string, any> = {
    ...$props,
    ...$interopMeta.styledProps,
    ...useInteractionHandlers($props, interaction, interopMeta.requiresLayout),
  };

  let children: JSX.Element = props.children;

  if (interopMeta.hasInlineVariables) {
    children = (
      <VariableContext.Provider value={variables}>
        {children}
      </VariableContext.Provider>
    );
  }

  if (interopMeta.hasInlineContainers) {
    children = (
      <ContainerContext.Provider value={containers}>
        {children}
      </ContainerContext.Provider>
    );
  }

  if (interopMeta.animationInteropKey) {
    return (
      <AnimationInterop
        {...props}
        ref={ref}
        key={interopMeta.animationInteropKey}
        __component={Component}
        __variables={variables}
        __containers={inheritedContainers}
        __interaction={interaction}
        __interopMeta={interopMeta}
        __skipCssInterop
      >
        {children}
      </AnimationInterop>
    );
  } else {
    return (
      <Component {...props} ref={ref} __skipCssInterop>
        {children}
      </Component>
    );
  }
});

function classNameToStyle({ className, ...props }: Record<string, unknown>) {
  if (typeof className === "string") {
    const classNameStyle = className
      .split(/\s+/)
      .map((s) => globalStyles.get(s));

    props.style = Array.isArray(props.style)
      ? [...classNameStyle, ...props.style]
      : props.style
      ? [...classNameStyle, props.style]
      : classNameStyle;

    if (Array.isArray(props.style) && props.style.length <= 1) {
      props.style = props.style[0];
    }
  }
  return props;
}

function areStylesDynamic(style: any) {
  if (!style) return false; // If there is no style, it can't be dynamic
  if (styleMetaMap.has(style)) return true; // If it's already tagged, it's dynamic

  // If we have an array of styles, check each one
  // We can then tag the array so we don't have to check it again
  if (Array.isArray(style) && style.some(areStylesDynamic)) {
    styleMetaMap.set(style, {});
    return true;
  }

  return false;
}

/* Micro optimizations. Save these externally so they are not recreated every render  */
const rerenderReducer = (acc: number) => acc + 1;
const defaultMeta: StyleMeta = { container: { names: [], type: "normal" } };
const initialMeta: InteropMeta = {
  styledProps: {},
  styledPropsMeta: {},
  variables: {},
  containers: {},
  animatedProps: new Set(),
  transitionProps: new Set(),
  requiresLayout: false,
  hasInlineVariables: false,
  hasInlineContainers: false,
};
