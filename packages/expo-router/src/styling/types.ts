import type {
  ImageStyle,
  MatrixTransform,
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TextStyle,
  TranslateXTransform,
  TranslateYTransform,
  ViewStyle,
} from "react-native";

import { runtimeStyleProps, variables } from "./runtime/native/symbols";

export interface RuntimeValue {
  type: "runtime";
  name: string;
  arguments: any[];
}

export interface RegisterOptions<T = any> {
  declarations?: NamedStyles<T>;
}

export type Style = (ViewStyle | TextStyle | ImageStyle) & {
  [runtimeStyleProps]?: Set<string>;
  [variables]?: Record<string, unknown>;
};

export type NamedStyles<T> = {
  [P in keyof T]: Style;
};

export type TransformRecord = Partial<
  PerpectiveTransform &
    RotateTransform &
    RotateXTransform &
    RotateYTransform &
    RotateZTransform &
    ScaleTransform &
    ScaleXTransform &
    ScaleYTransform &
    TranslateXTransform &
    TranslateYTransform &
    SkewXTransform &
    SkewYTransform &
    MatrixTransform
>;
