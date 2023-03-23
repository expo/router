declare module "react-native" {
  export * from "react-native/types";

  import {
    PressableProps as RNPressableProps,
    StyleProp,
    TextProps as RNTextProps,
    TextStyle as RNTextStyle,
    View,
    ViewStyle as RNViewStyle,
  } from "react-native/types";

  /**
   * View
   */
  export type ViewStyle = Omit<RNViewStyle, "position"> & {
    /** @platform web */
    backdropFilter?: string;
    /** @platform web */
    animationDelay?: string;
    /** @platform web */
    animationDirection?: string;
    /** @platform web */
    animationDuration?: string;
    /** @platform web */
    animationFillMode?: string;
    /** @platform web */
    animationName?: string | any[];
    /** @platform web */
    animationIterationCount?: number | "infinite";
    /** @platform web */
    animationPlayState?: string;
    /** @platform web */
    animationTimingFunction?: string;
    /** @platform web */
    backgroundAttachment?: string;
    /** @platform web */
    backgroundBlendMode?: string;
    /** @platform web */
    backgroundClip?: string;
    /** @platform web */
    backgroundImage?: string;
    /** @platform web */
    backgroundOrigin?: "border-box" | "content-box" | "padding-box";
    /** @platform web */
    backgroundPosition?: string;
    /** @platform web */
    backgroundRepeat?: string;
    /** @platform web */
    backgroundSize?: string;
    /** @platform web */
    boxShadow?: string;
    /** @platform web */
    boxSizing?: string;
    /** @platform web */
    clip?: string;
    /** @platform web */
    cursor?: string;
    /** @platform web */
    filter?: string;
    /** @platform web */
    gridAutoColumns?: string;
    /** @platform web */
    gridAutoFlow?: string;
    /** @platform web */
    gridAutoRows?: string;
    /** @platform web */
    gridColumnEnd?: string;
    /** @platform web */
    gridColumnGap?: string;
    /** @platform web */
    gridColumnStart?: string;
    /** @platform web */
    gridRowEnd?: string;
    /** @platform web */
    gridRowGap?: string;
    /** @platform web */
    gridRowStart?: string;
    /** @platform web */
    gridTemplateColumns?: string;
    /** @platform web */
    gridTemplateRows?: string;
    /** @platform web */
    gridTemplateAreas?: string;
    /** @platform web */
    outline?: string;
    /** @platform web */
    outlineColor?: string;
    /** @platform web */
    overflowX?: string;
    /** @platform web */
    overflowY?: string;
    /** @platform web */
    overscrollBehavior?: "auto" | "contain" | "none";
    /** @platform web */
    overscrollBehaviorX?: "auto" | "contain" | "none";
    /** @platform web */
    overscrollBehaviorY?: "auto" | "contain" | "none";
    /** @platform web */
    perspective?: string;
    /** @platform web */
    perspectiveOrigin?: string;
    /** @platform web */
    touchAction?: string;
    /** @platform web */
    transformOrigin?: string;
    /** @platform web */
    transitionDelay?: string;
    /** @platform web */
    transitionDuration?: string;
    /** @platform web */
    transitionProperty?: string;
    /** @platform web */
    transitionTimingFunction?: string;
    /** @platform web */
    userSelect?: string;
    /** @platform web */
    visibility?: string;
    /** @platform web */
    willChange?: string;
    /** @platform web */
    position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  };

  /**
   * Text
   */
  export type TextStyle = Omit<
    RNTextStyle,
    "position" | "fontSize" | "lineHeight"
  > &
    ViewStyle & {
      /** @platform web */
      fontFeatureSettings?: string;
      /** @platform web */
      textIndent?: string;
      /** @platform web */
      textOverflow?: string;
      /** @platform web */
      textRendering?: string;
      /** @platform web */
      textTransform?: string;
      /** @platform web */
      unicodeBidi?: string;
      /** @platform web */
      wordWrap?: string;
    };

  export type TextProps = Omit<RNTextProps, "style" | "accessibilityRole"> & {
    style?: StyleProp<TextStyle>;
    /** @platform web */
    tabIndex?: number;
    /** @platform web */
    accessibilityLevel?: number;
    /** @platform web */
    lang?: string;
  };

  /**
   * Pressable
   */
  export interface PressableStateCallbackType {
    readonly pressed: boolean;
  }

  export interface PressableProps extends Omit<RNPressableProps, "style"> {
    children?:
      | React.ReactNode
      | ((state: PressableStateCallbackType) => React.ReactNode)
      | undefined;
    style?:
      | StyleProp<ViewStyle>
      | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  }

  export const Pressable: React.ForwardRefExoticComponent<
    PressableProps & React.RefAttributes<View>
  >;
}
