import React, { ComponentType, useEffect, useReducer } from "react";

import { ContainerRuntime, Interaction, Style } from "../../types";
import { useAnimations } from "./animations";
import { flattenStyle } from "./flattenStyle";
import {
  ContainerContext,
  VariableContext,
  getGlobalStyles,
  styleMetaMap,
} from "./globals";
import { useInteractionHandlers, useInteractionSignals } from "./interaction";
import { createComputation } from "./signals";
import { StyleSheet } from "./stylesheet";
import { useTransitions } from "./transitions";
import { useDynamicMemo } from "./utils";

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
  const [, rerender] = React.useReducer((acc) => acc + 1, 0);
  const inheritedVariables = React.useContext(VariableContext);
  const inheritedContainers = React.useContext(ContainerContext);

  const inlineVariables: Record<string, unknown>[] = [];
  let inlineContainers: Record<string, ContainerRuntime> | undefined;
  const interaction = useInteractionSignals();

  const propEntries: [string, Style][] = [];
  const animatedProps: string[] = [];
  const transitionProps: string[] = [];

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
            containers: inheritedContainers,
          })
        ),
      [$props[key], inheritedVariables]
    );
    useEffect(() => computation.subscribe(rerender), [computation]);
    const style = computation.snapshot();
    propEntries.push([key, style]);

    const meta = styleMetaMap.get(style);

    if (meta) {
      if (meta.variables) {
        inlineVariables.push(meta.variables);
      }
      if (meta.container) {
        inlineContainers ??= {};
        if (meta.container.names) {
          for (const name of meta.container.names) {
            inlineContainers[name] = {
              type: meta.container.type,
              interaction,
              style,
            };
          }
        }

        inlineContainers.__default = {
          type: meta.container.type,
          interaction,
          style,
        };
      }
      if (meta.animations) {
        animatedProps.push(key);
      }
      if (meta.transition) {
        transitionProps.push(key);
      }
    }
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  const variables = useDynamicMemo(
    () => Object.assign({}, inheritedVariables, ...inlineVariables),
    [inheritedVariables, ...inlineVariables]
  );

  const inlineContainerValues = Object.values(inlineContainers ?? {});
  const containers = useDynamicMemo(
    () => Object.assign({}, inheritedContainers, inlineContainers),
    [inheritedContainers, ...inlineContainerValues]
  );

  const props = Object.assign(
    {},
    $props,
    useInteractionHandlers(
      $props,
      interaction,
      inlineContainerValues.length > 0
    )
  );

  let children: JSX.Element = props.children;

  if (inlineVariables.length > 0) {
    children = (
      <VariableContext.Provider value={variables}>
        {children}
      </VariableContext.Provider>
    );
  }

  if (inlineContainerValues.length > 0) {
    children = (
      <ContainerContext.Provider value={containers}>
        {children}
      </ContainerContext.Provider>
    );
  }

  if (animatedProps.length > 0) {
    return (
      <Animated
        {...props}
        ref={ref}
        __component={Component}
        __propEntries={propEntries}
        __variables={variables}
        __containers={inheritedContainers}
        __interaction={interaction}
        __skipCssInterop
      >
        {children}
      </Animated>
    );
  } else if (transitionProps.length > 0) {
    return (
      <Transitionable
        {...props}
        ref={ref}
        __component={Component}
        __propEntries={propEntries}
        __variables={variables}
        __containers={inheritedContainers}
        __interaction={interaction}
        __skipCssInterop
      >
        {children}
      </Transitionable>
    );
  } else {
    return (
      <Component
        {...props}
        {...Object.fromEntries(propEntries)}
        ref={ref}
        __skipCssInterop
      >
        {children}
      </Component>
    );
  }
});

type WrapperProps = Record<string, unknown> & {
  __component: ComponentType<any>;
  __interaction: Interaction;
  __variables: Record<string, unknown>;
  __containers: Record<string, ContainerRuntime>;
  __propEntries: [string, Style][];
};

function Animated({
  __component: Component,
  __propEntries,
  __interaction,
  __variables,
  __containers,
  ...props
}: WrapperProps) {
  /* eslint-disable react-hooks/rules-of-hooks */
  for (const [name, style] of __propEntries) {
    props[name] = useAnimations(style, {
      variables: __variables,
      interaction: __interaction,
      containers: __containers,
    });
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  return <Component {...props} />;
}

function Transitionable({
  __component: Component,
  __propEntries,
  __interaction,
  __variables,
  __containers,
  ...props
}: WrapperProps) {
  /* eslint-disable react-hooks/rules-of-hooks */
  for (const [name, style] of __propEntries) {
    props[name] = useTransitions(style);
  }
  // console.log(props.style);
  /* eslint-enable react-hooks/rules-of-hooks */
  return <Component {...props} />;
}

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
