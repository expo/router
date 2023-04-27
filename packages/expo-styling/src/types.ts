import type {
  MediaQuery,
  Animation,
  ContainerType,
  MediaCondition,
} from "lightningcss";
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
  pseudoClasses?: PseudoClassesQuery;
  animations?: ExtractedAnimations;
  container?: Partial<ExtractedContainer>;
  containerQuery?: ExtractedContainerQuery;
};

export type StyleMeta = {
  runtimeStyleProps?: Set<string>;
  variableProps?: Set<string>;
  media?: MediaQuery[];
  variables?: Record<string, unknown>;
  pseudoClasses?: PseudoClassesQuery;
  animations?: ExtractedAnimations;
  container?: ExtractedContainer;
  containerQuery?: ExtractedContainerQuery;
};

export interface SignalLike<T = unknown> {
  get(): T;
}

export interface MutableSignal<T = unknown> {
  get(): T;
  set(value: T): void;
}

export type Interaction = {
  active: MutableSignal<boolean>;
  hover: MutableSignal<boolean>;
  focus: MutableSignal<boolean>;
  layout: {
    width: MutableSignal<number>;
    height: MutableSignal<number>;
  };
};

export type ExtractedContainer = {
  names?: string[];
  type: ContainerType;
};

export type ContainerRuntime = {
  type: ContainerType;
  interaction: Interaction;
  style: Style;
};

export type ExtractedContainerQuery = {
  name?: string | null;
  condition: MediaCondition;
};

export type ExtractedAnimations = {
  [K in keyof Animation]?: Animation[K][];
};

export type ExtractedKeyframe = {
  selector: number;
  style: Record<string, ExtractedStyleValue>;
};

export type PseudoClassesQuery = {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
};

export type StyleSheetRegisterOptions = {
  declarations?: Record<string, ExtractedStyle | ExtractedStyle[]>;
  keyframes?: Record<string, ExtractedKeyframe[]>;
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

export type CamelToKebabCase<
  T extends string,
  A extends string = ""
> = T extends `${infer F}${infer R}`
  ? CamelToKebabCase<
      R,
      `${A}${F extends Lowercase<F> ? "" : "-"}${Lowercase<F>}`
    >
  : A;

export type KebabToCamelCase<S extends string> =
  S extends `${infer P1}-${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${KebabToCamelCase<P3>}`
    : Lowercase<S>;
