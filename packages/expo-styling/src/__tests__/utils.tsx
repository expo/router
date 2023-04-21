import React, { ComponentType, FunctionComponent } from "react";
import { View, ViewProps } from "react-native";

import {
  CssToReactNativeRuntimeOptions,
  cssToReactNativeRuntime,
} from "../css-to-rn";
import { defaultCSSInterop } from "../runtime/native/css-interop";
import { StyleSheet } from "../runtime/native/stylesheet";

export function registerCSS(
  css: string,
  options?: CssToReactNativeRuntimeOptions
) {
  StyleSheet.register(cssToReactNativeRuntime(Buffer.from(css), options));
}

type MockComponentProps = ViewProps & { className?: string };

export function createMockComponent(): FunctionComponent<MockComponentProps> {
  const component = jest.fn((props) => <View {...props} />);

  function mock(props: MockComponentProps) {
    return defaultCSSInterop(
      (Component: ComponentType<any>, props: object, key: string) => {
        return <Component {...props} key={key} />;
      },
      component,
      props,
      "key"
    );
  }

  return Object.assign(mock, { component });
}
