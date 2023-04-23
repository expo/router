import { MediaQuery } from "lightningcss";
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

export type SignalLike<T = unknown> = {
  get(): T;
};

export type RuntimeValue = {
  type: "runtime";
  name: string;
  arguments: any[];
};

export type ExtractedStyleValue =
  | string
  | number
  | RuntimeValue
  | ExtractedStyleValue[];

export type ExtractedStyle = {
  runtimeStyleProps: string[];
  variableProps: string[];
  media?: MediaQuery[];
  style: Record<string, ExtractedStyleValue>;
};

export type StyleMeta = {
  runtimeStyleProps?: Set<string>;
  variableProps?: Set<string>;
  media?: MediaQuery[];
  variables?: Record<string, unknown>;
};

export type StyleSheetRegisterOptions = {
  declarations?: Record<string, ExtractedStyle | ExtractedStyle[]>;
};

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleProp = Style | StyleProp[] | undefined;

export type NamedStyles<T> = {
  [P in keyof T]: StyleProp;
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
