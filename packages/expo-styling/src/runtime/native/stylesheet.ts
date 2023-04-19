import {
  Dimensions,
  StyleSheet as RNStyleSheet,
  Appearance,
} from "react-native";

import {
  colorScheme,
  globalStyles,
  rem,
  styleMetaMap,
  vh,
  vw,
} from "./globals";
import {
  StyleSheetRegisterOptions,
  ExtractedStyle,
  StyleProp,
  StyleMeta,
} from "../../types";

const subscriptions = new Set<() => void>();

/**
 * This is a custom wrapper around the React Native Stylesheet.
 * It allows us to intercept the creation of styles and "tag" them wit the metadata
 */
const parialStyleSheet = {
  rem,
  __subscribe(subscription: () => void) {
    subscriptions.add(subscription);
    return () => {
      subscriptions.delete(subscription);
    };
  },
  __reset({ dimensions = Dimensions, appearance = Appearance } = {}) {
    globalStyles.clear();
    rem.reset();
    vw.reset(dimensions);
    vh.reset(dimensions);
    colorScheme.reset(appearance);
  },
  register: (options: StyleSheetRegisterOptions) => {
    if (options.declarations) {
      for (const [name, styles] of Object.entries(options.declarations)) {
        globalStyles.set(name, tagStyles(styles));
      }
    }

    for (const subscription of subscriptions) {
      subscription();
    }
  },
  create: (styles: Record<string, ExtractedStyle>) => {
    const namedStyles: Record<string, StyleProp> = {};

    for (const [name, style] of Object.entries(styles)) {
      namedStyles[name] = tagStyles(style);
    }

    for (const subscription of subscriptions) {
      subscription();
    }

    return namedStyles;
  },
};

export const StyleSheet = Object.assign({}, RNStyleSheet, parialStyleSheet);

function tagStyles(styles: ExtractedStyle | ExtractedStyle[]): StyleProp {
  if (Array.isArray(styles)) {
    let didTag = false;
    const taggedStyles = styles.map((s) => {
      const taggedStyle = tagStyles(s);
      didTag ||= styleMetaMap.has(s.style);
      return taggedStyle;
    });

    if (didTag) {
      styleMetaMap.set(taggedStyles, {});
    }

    return taggedStyles;
  } else {
    const meta: StyleMeta = {};
    let hasMeta = false;

    if (
      Array.isArray(styles.runtimeStyleProps) &&
      styles.runtimeStyleProps.length > 0
    ) {
      meta.runtimeStyleProps = new Set<string>(styles.runtimeStyleProps);
      hasMeta = true;
    }

    if (
      Array.isArray(styles.variableProps) &&
      styles.variableProps.length > 0
    ) {
      meta.variableProps = new Set<string>(styles.variableProps);
      hasMeta = true;
    }

    if (Array.isArray(styles.media) && styles.media.length > 0) {
      meta.media = styles.media;
      hasMeta = true;
    }
    if (styles.pseudoClasses) {
      meta.pseudoClasses = styles.pseudoClasses;
      hasMeta = true;
    }

    if (hasMeta) {
      styleMetaMap.set(styles.style, meta);
    }

    return styles.style;
  }
}
