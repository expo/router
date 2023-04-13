import { Dimensions, StyleSheet as RNStyleSheet } from "react-native";

import { globalStyles, rem, vh, vw } from "./globals";
import { isRuntimeValue } from "./guards";
import { runtimeStyleProps } from "./symbols";
import { NamedStyles, RegisterOptions, Style } from "../../types";

const parialStyleSheet = {
  rem,
  __reset() {
    globalStyles.clear();
    rem.reset();
    vw.reset(Dimensions);
    vh.reset(Dimensions);
  },
  register: <T extends NamedStyles<T> | NamedStyles<string>>(
    options: RegisterOptions<T>
  ) => {
    if (options.declarations) {
      const entries = Object.entries(options.declarations) satisfies [
        string,
        Style
      ][];

      for (const [name, style] of entries) {
        style[runtimeStyleProps] = new Set<string>();

        for (const [key, value] of Object.entries(style)) {
          if (isRuntimeValue(value)) {
            style[runtimeStyleProps].add(key);
          }
        }

        globalStyles.set(name, style);
      }
    }
  },
};

export const StyleSheet = Object.assign({}, RNStyleSheet, parialStyleSheet);
