import React, { ComponentType, FunctionComponent } from "react";
import { View, ViewProps } from "react-native";

import { cssToReactNativeRuntime } from "../css-to-rn";
import { defaultCSSInterop } from "../runtime/native/css-interop";
import { StyleSheet } from "../runtime/native/stylesheet";

export function registerCSS(css: string) {
  StyleSheet.register(cssToReactNativeRuntime(css));
}

type MockComponentProps = ViewProps & { className?: string };

export const createMockComponent = () => {
  const component = jest.fn((props) => <View {...props} />);

  return Object.assign(
    ((props: MockComponentProps) => {
      return defaultCSSInterop(
        (Component: ComponentType<any>, _props: object, key: string) => {
          return <Component {..._props} key={key} />;
        },
        component,
        props as Record<string | number, unknown>,
        "key"
      );
    }) as FunctionComponent<MockComponentProps>,
    { component }
  );
};
