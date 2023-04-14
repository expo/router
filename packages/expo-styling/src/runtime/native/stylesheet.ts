import { Dimensions, StyleSheet as RNStyleSheet } from "react-native";

import { globalStyles, rem, styleMetaMap, vh, vw } from "./globals";
import {
  StyleSheetRegisterOptions,
  ExtractedStyle,
  StyleProp,
  StyleMeta,
} from "../../types";

const subscriptions = new Set<() => void>();

const parialStyleSheet = {
  rem,
  __subscribe(subscription: () => void) {
    subscriptions.add(subscription);
    return () => {
      subscriptions.delete(subscription);
    };
  },
  __reset() {
    globalStyles.clear();
    rem.reset();
    vw.reset(Dimensions);
    vh.reset(Dimensions);
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
};

export const StyleSheet = Object.assign({}, RNStyleSheet, parialStyleSheet);

function tagStyles(styles: ExtractedStyle | ExtractedStyle[]): StyleProp {
  if (Array.isArray(styles)) {
    return styles.map((s) => tagStyles(s));
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

    if (hasMeta) {
      styleMetaMap.set(styles.style, meta);
    }

    return styles.style;
  }
}
