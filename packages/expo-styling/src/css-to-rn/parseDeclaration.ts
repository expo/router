import {
  AlignContent,
  AlignItems,
  AlignSelf,
  Angle,
  BorderSideWidth,
  BorderStyle,
  CssColor,
  Declaration,
  DimensionPercentageFor_LengthValue,
  FontSize,
  FontWeight,
  JustifyContent,
  Length,
  LengthPercentageOrAuto,
  LengthValue,
  LineStyle,
  MaxSize,
  NumberOrPercentage,
  OverflowKeyword,
  Size,
  TextDecorationLine,
  TextShadow,
  TokenOrValue,
} from "lightningcss";

import { exhaustiveCheck } from "./utils";
import { RuntimeValue, TransformRecord } from "../types";

type AddStyleProp = (
  property: string,
  value: unknown,
  options?: {
    nullishCoalescing?: boolean;
    append?: boolean;
  }
) => void;

export function parseDeclaration(
  declaration: Declaration,
  addStyleProp: AddStyleProp
) {
  if (declaration.property === "unparsed") {
    return addStyleProp(
      declaration.value.propertyId.property,
      parseUnparsed(declaration.value.value)
    );
  } else if (declaration.property === "custom") {
    return addStyleProp(
      declaration.value.name,
      parseUnparsed(declaration.value.value)
    );
  }

  const value = declaration.value;

  if (!value || typeof value === "string" || typeof value === "number") {
    return addStyleProp(declaration.property, value);
  }

  switch (declaration.property) {
    case "font-size":
      addStyleProp(declaration.property, parseFontSize(declaration.value));
      break;
    case "color":
    case "background-color":
      addStyleProp(declaration.property, parseColor(declaration.value));
      break;
    case "height":
    case "width":
    case "min-width":
    case "min-height":
    case "max-width":
    case "max-height":
    case "top":
    case "bottom":
    case "left":
    case "right":
    case "padding-top":
    case "padding-bottom":
    case "padding-left":
    case "padding-right":
    case "margin-top":
    case "margin-bottom":
    case "margin-left":
    case "margin-right":
      addStyleProp(declaration.property, parseSize(declaration.value));
      break;
    case "flex-flow":
      addStyleProp("flexWrap", declaration.value.wrap);
      addStyleProp("flexDirection", declaration.value.direction);
      break;
    case "column-gap":
      if (declaration.value.type === "length-percentage") {
        addStyleProp("gap", parseSize(declaration.value));
      }
      break;
    case "gap":
      if (declaration.value.column.type === "length-percentage") {
        addStyleProp(declaration.property, parseSize(declaration.value.column));
      }
      break;
    case "margin":
      addStyleProp("marginTop", parseSize(declaration.value.top));
      addStyleProp("marginLeft", parseSize(declaration.value.left));
      addStyleProp("marginRigth", parseSize(declaration.value.right));
      addStyleProp("marginBottom", parseSize(declaration.value.bottom));
      break;
    case "padding":
      addStyleProp("paddingTop", parseSize(declaration.value.top));
      addStyleProp("paddingLeft", parseSize(declaration.value.left));
      addStyleProp("paddingRigth", parseSize(declaration.value.right));
      addStyleProp("paddingBottom", parseSize(declaration.value.bottom));
      break;
    case "align-content":
      addStyleProp(declaration.property, parseAlignContent(declaration.value));
      break;
    case "align-items":
      addStyleProp(declaration.property, parseAlignItems(declaration.value));
      break;
    case "align-self":
      addStyleProp(declaration.property, parseAlignSelf(declaration.value));
      break;
    case "justify-content":
      addStyleProp(
        declaration.property,
        parseJustifyContent(declaration.value)
      );
      break;
    case "flex":
      addStyleProp("flex-grow", declaration.value.grow);
      addStyleProp("flex-shrink", declaration.value.shrink);
      addStyleProp(
        "flex-basis",
        parseLengthPercentageOrAuto(declaration.value.basis)
      );
      break;
    case "font-weight":
      addStyleProp(declaration.property, parseFontWeight(declaration.value));
      break;
    case "text-shadow":
      parseTextShadow(declaration.value, addStyleProp);
      break;
    case "letter-spacing": {
      if (declaration.value.type !== "normal") {
        addStyleProp(
          declaration.property,
          parseLength(declaration.value.value)
        );
      }
      break;
    }
    case "text-decoration-color":
      addStyleProp(declaration.property, parseColor(declaration.value));
      break;
    case "text-decoration-line":
      addStyleProp(
        declaration.property,
        parseTextDecorationLine(declaration.value)
      );
      break;
    case "text-decoration-thickness":
      if (declaration.value.type === "length-percentage") {
        addStyleProp(
          declaration.property,
          parseLength(declaration.value.value)
        );
      }
      break;
    case "text-decoration":
      addStyleProp(
        "text-decoration-color",
        parseColor(declaration.value.color)
      );
      addStyleProp(
        "text-decoration-line",
        parseTextDecorationLine(declaration.value.line)
      );
      if (declaration.value.thickness.type === "length-percentage") {
        addStyleProp(
          declaration.property,
          parseLength(declaration.value.thickness.value)
        );
      }
      break;
    case "text-transform":
      addStyleProp(declaration.property, declaration.value.case);
      break;

    case "border-top-width":
    case "border-bottom-width":
    case "border-left-width":
    case "border-right-width": {
      if (declaration.value.type === "length") {
        addStyleProp(
          declaration.property,
          parseLength(declaration.value.value)
        );
      }
      break;
    }
    case "border-top-color":
    case "border-bottom-color":
    case "border-left-color":
    case "border-right-color":
      addStyleProp(declaration.property, parseColor(declaration.value));
      break;
    case "z-index":
      if (declaration.value.type === "integer") {
        addStyleProp(
          declaration.property,
          parseLength(declaration.value.value)
        );
      }
      break;
    case "border-top-left-radius":
    case "border-top-right-radius":
    case "border-bottom-left-radius":
    case "border-bottom-right-radius":
    case "border-start-start-radius":
    case "border-start-end-radius":
    case "border-end-start-radius":
    case "border-end-end-radius":
      addStyleProp(declaration.property, parseLength(declaration.value[0]));
      break;
    case "display":
      if (
        declaration.value.type === "keyword" &&
        declaration.value.value === "none"
      ) {
        addStyleProp(declaration.property, declaration.value.value);
      } else if (
        declaration.value.type === "pair" &&
        declaration.value.inside.type === "flex"
      ) {
        addStyleProp(declaration.property, declaration.value.inside.type);
      }
      break;
    case "border-radius":
      addStyleProp(
        "border-bottom-left-radius",
        parseLength(declaration.value.bottomLeft[0]),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "border-bottom-right-radius",
        parseLength(declaration.value.bottomRight[0]),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "border-top-left-radius",
        parseLength(declaration.value.topLeft[0]),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "border-top-right-radius",
        parseLength(declaration.value.topRight[0]),
        { nullishCoalescing: true }
      );
      break;
    case "overflow":
      addStyleProp(declaration.property, parseOverflow(declaration.value.x));
      break;
    case "inset-block-start":
    case "inset-block-end":
      addStyleProp(
        declaration.property,
        parseLengthPercentageOrAuto(declaration.value)
      );
      break;
    case "inset-block":
      addStyleProp(
        "inset-block-start",
        parseLengthPercentageOrAuto(declaration.value.blockStart),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "inset-block-end",
        parseLengthPercentageOrAuto(declaration.value.blockEnd),
        { nullishCoalescing: true }
      );
      break;
    case "inset":
      addStyleProp("top", parseLengthPercentageOrAuto(declaration.value.top), {
        nullishCoalescing: true,
      });
      addStyleProp(
        "bottom",
        parseLengthPercentageOrAuto(declaration.value.bottom),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "left",
        parseLengthPercentageOrAuto(declaration.value.left),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "right",
        parseLengthPercentageOrAuto(declaration.value.right),
        { nullishCoalescing: true }
      );
      break;
    case "border-color":
      addStyleProp("border-top-color", parseColor(declaration.value.top), {
        nullishCoalescing: true,
      });
      addStyleProp(
        "border-bottom-color",
        parseColor(declaration.value.bottom),
        {
          nullishCoalescing: true,
        }
      );
      addStyleProp("border-left-color", parseColor(declaration.value.left), {
        nullishCoalescing: true,
      });
      addStyleProp("border-right-color", parseColor(declaration.value.right), {
        nullishCoalescing: true,
      });
      break;
    case "border-style":
      addStyleProp(declaration.property, parseBorderStyle(declaration.value));
      break;
    case "border-width":
      addStyleProp(
        "border-top-width",
        parseBorderSideWidth(declaration.value.top),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "border-bottom-width",
        parseBorderSideWidth(declaration.value.bottom),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "border-left-width",
        parseBorderSideWidth(declaration.value.left),
        { nullishCoalescing: true }
      );
      addStyleProp(
        "border-right-width",
        parseBorderSideWidth(declaration.value.right),
        { nullishCoalescing: true }
      );
      break;
    case "border":
      addStyleProp(
        "border-width",
        parseBorderSideWidth(declaration.value.width),
        {
          nullishCoalescing: true,
        }
      );
      addStyleProp("border-style", parseBorderStyle(declaration.value.style), {
        nullishCoalescing: true,
      });
      break;
    case "border-top":
    case "border-bottom":
    case "border-left":
    case "border-right":
      addStyleProp(
        declaration.property + "-color",
        parseColor(declaration.value.color)
      );
      addStyleProp(
        declaration.property + "-width",
        parseBorderSideWidth(declaration.value.width)
      );
      break;
    case "margin-block-start":
    case "margin-block-end":
    case "margin-inline-start":
    case "margin-inline-end":
      addStyleProp(
        declaration.property,
        parseLengthPercentageOrAuto(declaration.value)
      );
      break;
    case "padding-block-start":
    case "padding-block-end":
    case "padding-inline-start":
    case "padding-inline-end":
      addStyleProp(
        declaration.property,
        parseLengthPercentageOrAuto(declaration.value)
      );
      break;
    case "margin-block":
    case "padding-block":
      addStyleProp(
        declaration.property + "-start",
        parseLengthPercentageOrAuto(declaration.value.blockStart),
        { nullishCoalescing: true }
      );
      addStyleProp(
        declaration.property + "-end",
        parseLengthPercentageOrAuto(declaration.value.blockEnd),
        { nullishCoalescing: true }
      );
      break;
    case "margin-inline":
    case "padding-inline":
      addStyleProp(
        declaration.property + "-start",
        parseLengthPercentageOrAuto(declaration.value.inlineStart),
        { nullishCoalescing: true }
      );
      addStyleProp(
        declaration.property + "-end",
        parseLengthPercentageOrAuto(declaration.value.inlineEnd),
        { nullishCoalescing: true }
      );
      break;
    case "animation":
    case "animation-name":
    case "animation-duration":
    case "animation-timing-function":
    case "animation-iteration-count":
    case "animation-direction":
    case "animation-play-state":
    case "animation-delay":
    case "animation-fill-mode":
    case "container-name":
    case "container":
    case "place-content":
    case "justify-self":
    case "place-self":
    case "justify-items":
    case "place-items":
    case "border-block-start-color": // https://github.com/facebook/react-native/issues/34425
    case "border-block-end-color":
    case "border-inline-start-color":
    case "border-inline-end-color":
    case "border-block-start-width":
    case "border-block-end-width":
    case "border-inline-start-width":
    case "border-inline-end-width":
    case "background":
    case "background-image":
    case "background-position-x":
    case "background-position-y":
    case "background-position":
    case "background-size":
    case "background-repeat":
    case "background-attachment":
    case "background-clip":
    case "background-origin":
    case "box-shadow":
    case "block-size":
    case "inline-size":
    case "min-block-size":
    case "min-inline-size":
    case "max-block-size":
    case "max-inline-size":
    case "position":
    case "inset-inline-start":
    case "inset-inline-end":
    case "inset-inline":
    case "border-spacing":
    case "border-image-source":
    case "border-image-outset":
    case "border-image-repeat":
    case "border-image-width":
    case "border-image-slice":
    case "border-image":
    case "border-block-color":
    case "border-block-style":
    case "border-block-width":
    case "border-inline-color":
    case "border-inline-style":
    case "border-inline-width":
    case "border-block":
    case "border-block-start":
    case "border-block-end":
    case "border-inline":
    case "border-inline-start":
    case "border-inline-end":
    case "outline":
    case "outline-color":
    case "outline-style":
    case "outline-width":
    case "flex-basis":
    case "row-gap":
    case "flex-preferred-size":
    case "grid-template-columns":
    case "grid-template-rows":
    case "grid-auto-columns":
    case "grid-auto-rows":
    case "grid-auto-flow":
    case "grid-template-areas":
    case "grid-template":
    case "grid":
    case "grid-row-start":
    case "grid-row-end":
    case "grid-column-start":
    case "grid-column-end":
    case "grid-row":
    case "grid-column":
    case "grid-area":
    case "scroll-margin-top":
    case "scroll-margin-bottom":
    case "scroll-margin-left":
    case "scroll-margin-right":
    case "scroll-margin-block-start":
    case "scroll-margin-block-end":
    case "scroll-margin-inline-start":
    case "scroll-margin-inline-end":
    case "scroll-margin-block":
    case "scroll-margin-inline":
    case "scroll-margin":
    case "scroll-padding-top":
    case "scroll-padding-bottom":
    case "scroll-padding-left":
    case "scroll-padding-right":
    case "scroll-padding-block-start":
    case "scroll-padding-block-end":
    case "scroll-padding-inline-start":
    case "scroll-padding-inline-end":
    case "scroll-padding-block":
    case "scroll-padding-inline":
    case "scroll-padding":
    case "font-stretch":
    case "font-family":
    case "font-style":
    case "line-height":
    case "font":
    case "vertical-align":
    case "font-palette":
    case "transition-property":
    case "transition-duration":
    case "transition-delay":
    case "transition-timing-function":
    case "transition":
    case "transform-origin":
    case "perspective":
    case "perspective-origin":
    case "tab-size":
    case "word-spacing":
    case "text-indent":
    case "text-emphasis-style":
    case "text-emphasis-color":
    case "text-emphasis":
    case "text-emphasis-position":
    case "cursor":
    case "caret-color":
    case "caret":
    case "accent-color":
    case "list-style-type":
    case "list-style-image":
    case "list-style":
    case "composes":
    case "fill":
    case "stroke":
    case "stroke-width":
    case "stroke-dasharray":
    case "stroke-dashoffset":
    case "marker-start":
    case "marker-mid":
    case "marker-end":
    case "marker":
    case "clip-path":
    case "mask-image":
    case "mask-mode":
    case "mask-repeat":
    case "mask-position-x":
    case "mask-position-y":
    case "mask-position":
    case "mask-clip":
    case "mask-origin":
    case "mask-size":
    case "mask-composite":
    case "mask":
    case "mask-border-source":
    case "mask-border-slice":
    case "mask-border-width":
    case "mask-border-outset":
    case "mask-border-repeat":
    case "mask-border":
    case "-webkit-mask-composite":
    case "mask-source-type":
    case "mask-box-image":
    case "mask-box-image-source":
    case "mask-box-image-slice":
    case "mask-box-image-width":
    case "mask-box-image-outset":
    case "mask-box-image-repeat":
    case "filter":
    case "backdrop-filter":
      break;
    case "translate":
      addStyleProp(
        "transform",
        [
          { translateX: declaration.value.x },
          { translateY: declaration.value.y },
        ],
        { append: true }
      );
      break;
    case "rotate":
      addStyleProp(
        "transform",
        [
          { rotateX: declaration.value.x },
          { rotateY: declaration.value.y },
          { rotateY: declaration.value.z },
        ],
        { append: true }
      );
      break;
    case "scale":
      addStyleProp(
        "transform",
        [
          { scaleX: parseLength(declaration.value.x) },
          { scaleY: parseLength(declaration.value.y) },
        ],
        { append: true }
      );
      break;
    case "transform": {
      const transforms: TransformRecord[] = [];

      for (const transform of declaration.value) {
        switch (transform.type) {
          case "perspective":
          case "translateX":
          case "translateY":
          case "scaleX":
          case "scaleY":
            transforms.push({
              [transform.type]: parseLength(transform.value) as number,
            });
            break;
          case "rotate":
          case "rotateX":
          case "rotateY":
          case "rotateZ":
          case "skewX":
          case "skewY":
            transforms.push({ [transform.type]: parseAngle(transform.value) });
            break;
          case "translate":
            transforms.push({
              translateX: parseLength(transform.value[0]) as number,
            });
            transforms.push({
              translateY: parseLength(transform.value[1]) as number,
            });
            break;
          case "scale":
            transforms.push({
              scaleX: parseLength(transform.value[0]) as number,
            });
            transforms.push({
              scaleY: parseLength(transform.value[1]) as number,
            });
            break;
          case "skew":
            transforms.push({ skewX: parseAngle(transform.value[0]) });
            transforms.push({ skewY: parseAngle(transform.value[1]) });
            break;
          case "translateZ":
          case "translate3d":
          case "scaleZ":
          case "scale3d":
          case "rotate3d":
          case "matrix":
          case "matrix3d":
            break;
        }
      }

      return addStyleProp(declaration.property, transforms);
    }
    default: {
      exhaustiveCheck(declaration);
    }
  }

  return undefined;
}
/**
 * When the CSS cannot be parsed (often due to a runtime condition like a CSS variable)
 * This function best efforts parsing it into a function that we can evaluate at runtime
 */
function parseUnparsed(
  tokenOrValue: TokenOrValue | TokenOrValue[] | string | number
): string | number | object | undefined {
  if (typeof tokenOrValue === "string" || typeof tokenOrValue === "number") {
    return tokenOrValue;
  }

  if (Array.isArray(tokenOrValue)) {
    return tokenOrValue.length === 1
      ? parseUnparsed(tokenOrValue[0])
      : tokenOrValue.map((v) => parseUnparsed(v));
  }

  switch (tokenOrValue.type) {
    case "unresolved-color": {
      const value = tokenOrValue.value;
      if (value.type === "rgb") {
        return {
          type: "runtime",
          name: "rgba",
          arguments: [
            value.r * 255,
            value.g * 255,
            value.b * 255,
            parseUnparsed(tokenOrValue.value.alpha),
          ],
        };
      } else {
        return {
          type: "runtime",
          name: tokenOrValue.value.type,
          arguments: [
            value.h,
            value.s,
            value.l,
            parseUnparsed(tokenOrValue.value.alpha),
          ],
        };
      }
    }
    case "var": {
      return {
        type: "runtime",
        name: "var",
        arguments: [tokenOrValue.value.name.ident, tokenOrValue.value.fallback],
      };
    }
    case "function":
      return {
        type: tokenOrValue.type,
        name: tokenOrValue.value.name,
        arguments: tokenOrValue.value.arguments
          .map((v) => parseUnparsed(v))
          .filter((v) => v !== undefined),
      };
    case "length":
      return parseLength(tokenOrValue.value);
    case "color":
    case "url":
    case "env":
    case "angle":
    case "time":
    case "resolution":
    case "dashed-ident":
      return;
    case "token":
      switch (tokenOrValue.value.type) {
        case "string":
        case "number":
          return tokenOrValue.value.value;
        case "function":
        case "ident":
        case "at-keyword":
        case "hash":
        case "id-hash":
        case "unquoted-url":
        case "delim":
        case "percentage":
        case "dimension":
        case "white-space":
        case "comment":
        case "colon":
        case "semicolon":
        case "comma":
        case "include-match":
        case "dash-match":
        case "prefix-match":
        case "suffix-match":
        case "substring-match":
        case "cdo":
        case "cdc":
        case "parenthesis-block":
        case "square-bracket-block":
        case "curly-bracket-block":
        case "bad-url":
        case "bad-string":
        case "close-parenthesis":
        case "close-square-bracket":
        case "close-curly-bracket":
          return undefined;
        default: {
          exhaustiveCheck(tokenOrValue.value);
          return;
        }
      }
    default: {
      exhaustiveCheck(tokenOrValue);
    }
  }

  return undefined;
}

export function parseLength(
  length:
    | number
    | Length
    | DimensionPercentageFor_LengthValue
    | NumberOrPercentage
    | LengthValue
): number | string | RuntimeValue | undefined {
  if (typeof length === "number") {
    return length;
  }

  if ("unit" in length) {
    switch (length.unit) {
      case "px":
        return length.value;
      case "vw":
      case "vh":
      case "rem":
        return {
          type: "runtime",
          name: length.unit,
          arguments: [length.value],
        };
      case "in":
      case "cm":
      case "mm":
      case "q":
      case "pt":
      case "pc":
      case "em":
      case "ex":
      case "rex":
      case "ch":
      case "rch":
      case "cap":
      case "rcap":
      case "ic":
      case "ric":
      case "lh":
      case "rlh":
      case "lvw":
      case "svw":
      case "dvw":
      case "cqw":
      case "lvh":
      case "svh":
      case "dvh":
      case "cqh":
      case "vi":
      case "svi":
      case "lvi":
      case "dvi":
      case "cqi":
      case "vb":
      case "svb":
      case "lvb":
      case "dvb":
      case "cqb":
      case "vmin":
      case "svmin":
      case "lvmin":
      case "dvmin":
      case "cqmin":
      case "vmax":
      case "svmax":
      case "lvmax":
      case "dvmax":
      case "cqmax":
        return undefined;
      default: {
        exhaustiveCheck(length.unit);
      }
    }
  } else {
    switch (length.type) {
      case "calc": {
        return undefined;
      }
      case "number": {
        return length.value;
      }
      case "percentage": {
        return `${round(length.value * 100)}%`;
      }
      case "dimension":
      case "value": {
        return parseLength(length.value);
      }
    }
  }
  return undefined;
}

function parseAngle(angle: Angle) {
  switch (angle.type) {
    case "deg":
    case "rad":
      return `${angle.value}${angle.type}`;
    default:
      return undefined;
  }
}

function parseSize(size: Size | MaxSize) {
  switch (size.type) {
    case "length-percentage":
      return parseLength(size.value);
    case "none":
      return size.type;
    case "auto":
      return size.type;
    case "min-content":
    case "max-content":
    case "fit-content":
    case "fit-content-function":
    case "stretch":
    case "contain":
      return undefined;
    default: {
      exhaustiveCheck(size);
    }
  }

  return undefined;
}

function parseColor(color: CssColor) {
  switch (color.type) {
    case "rgb":
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.alpha})`;
    case "hsl":
      return `hsla(${color.h}, ${color.s}, ${color.l}, ${color.alpha})`;
    case "currentcolor":
    case "lab":
    case "lch":
    case "oklab":
    case "oklch":
    case "srgb":
    case "srgb-linear":
    case "display-p3":
    case "a98-rgb":
    case "prophoto-rgb":
    case "rec2020":
    case "xyz-d50":
    case "xyz-d65":
    case "hwb":
      return undefined;
    default: {
      exhaustiveCheck(color);
    }
  }
  return undefined;
}

function parseFontSize(fontSize: FontSize) {
  switch (fontSize.type) {
    case "length":
      return parseLength(fontSize.value);
    case "absolute":
    case "relative":
      return undefined;
    default: {
      exhaustiveCheck(fontSize);
    }
  }
  return undefined;
}

function parseLengthPercentageOrAuto(
  lengthPercentageOrAuto: LengthPercentageOrAuto
) {
  switch (lengthPercentageOrAuto.type) {
    case "auto":
      return;
    case "length-percentage":
      return parseLength(lengthPercentageOrAuto.value);
    default: {
      exhaustiveCheck(lengthPercentageOrAuto);
    }
  }
  return undefined;
}

function parseJustifyContent(justifyContent: JustifyContent) {
  const allowed = new Set([
    "flex-start",
    "flex-end",
    "center",
    "space-between",
    "space-around",
    "space-evenly",
  ]);

  let value: string | undefined;

  switch (justifyContent.type) {
    case "normal":
      return;
    case "left":
    case "right":
      return;
    case "content-distribution":
    case "content-position":
      value = justifyContent.value;
      break;
    default: {
      exhaustiveCheck(justifyContent);
    }
  }

  if (value && !allowed.has(value)) {
    return;
  }

  return value;
}

function parseAlignContent(alignItems: AlignContent) {
  const allowed = new Set([
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "space-between",
    "space-around",
  ]);

  let value: string | undefined;

  switch (alignItems.type) {
    case "normal":
    case "baseline-position":
      break;
    case "content-distribution":
      value = alignItems.value;
      break;
    case "content-position":
      value = alignItems.value;
      break;
    default: {
      exhaustiveCheck(alignItems);
    }
  }

  if (value && !allowed.has(value)) {
    return;
  }

  return value;
}

function parseAlignItems(alignItems: AlignItems) {
  const allowed = new Set([
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "baseline",
  ]);

  let value: string | undefined;

  switch (alignItems.type) {
    case "normal":
      return "auto";
    case "stretch":
      value = alignItems.type;
      break;
    case "baseline-position":
      value = "baseline";
      break;
    case "self-position":
      value = alignItems.value;
      break;
    default: {
      exhaustiveCheck(alignItems);
    }
  }

  if (value && !allowed.has(value)) {
    return;
  }

  return value;
}

function parseAlignSelf(alignItems: AlignSelf) {
  const allowed = new Set([
    "auto",
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "baseline",
  ]);

  let value: string | undefined;

  switch (alignItems.type) {
    case "normal":
    case "auto":
      return "auto";
    case "stretch":
      value = alignItems.type;
      break;
    case "baseline-position":
      value = "baseline";
      break;
    case "self-position":
      value = alignItems.value;
      break;
    default: {
      exhaustiveCheck(alignItems);
    }
  }

  if (value && !allowed.has(value)) {
    return;
  }

  return value;
}

function parseFontWeight(fontWeight: FontWeight) {
  switch (fontWeight.type) {
    case "absolute":
      if (fontWeight.value.type === "weight") {
        return fontWeight.value.value;
      } else {
        return fontWeight.value.type;
      }
    case "bolder":
    case "lighter":
      return;
    default: {
      exhaustiveCheck(fontWeight);
    }
  }
  return undefined;
}

function parseTextShadow(
  [textshadow]: TextShadow[],
  addStyleProp: AddStyleProp
) {
  addStyleProp("textShadowColor", parseColor(textshadow.color));
  addStyleProp("textShadowOffset", {
    width: parseLength(textshadow.xOffset),
    height: parseLength(textshadow.yOffset),
  });
  addStyleProp("textShadowRadius", parseLength(textshadow.blur));
}

function parseTextDecorationLine(textDecorationLine: TextDecorationLine) {
  if (!Array.isArray(textDecorationLine)) {
    if (textDecorationLine === "none") {
      return textDecorationLine;
    }
    return;
  }

  const set = new Set(textDecorationLine);

  if (set.has("underline")) {
    if (set.has("line-through")) {
      return "underline line-through";
    } else {
      return "underline";
    }
  } else if (set.has("line-through")) {
    return "line-through";
  }

  return undefined;
}

function parseOverflow(overflow: OverflowKeyword) {
  const allowed = new Set(["visible", "hidden", "scroll"]);

  if (allowed.has(overflow)) {
    return overflow;
  }

  return undefined;
}

function parseBorderStyle(borderStyle: BorderStyle | LineStyle) {
  const allowed = new Set(["solid", "dotted", "dashed"]);

  if (typeof borderStyle === "string") {
    if (allowed.has(borderStyle)) {
      return borderStyle;
    } else {
      return undefined;
    }
  } else if (
    borderStyle.top === borderStyle.bottom &&
    borderStyle.top === borderStyle.left &&
    borderStyle.top === borderStyle.right &&
    allowed.has(borderStyle.top)
  ) {
    return borderStyle.top;
  }

  return undefined;
}

function parseBorderSideWidth(borderSideWidth: BorderSideWidth) {
  if (borderSideWidth.type === "length") {
    return parseLength(borderSideWidth.value);
  }

  return undefined;
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}