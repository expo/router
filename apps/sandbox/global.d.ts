declare module "*.module.css" {
  import { ViewStyle, TextStyle, ImageStyle } from "@bacons/react-views";

  type ExpoStyle = ViewStyle | TextStyle | ImageStyle;

  const classes: { readonly [key: string]: NamedStyle };
  export default classes;
}

declare module "*.module.scss" {
  import { ViewStyle, TextStyle, ImageStyle } from "@bacons/react-views";

  type ExpoStyle = ViewStyle | TextStyle | ImageStyle;

  const classes: { readonly [key: string]: NamedStyle };
  export default classes;
}
