import { BabelTransformerArgs } from "metro-babel-transformer";
import { transformCssModule } from "./css-modules";
import { transformCssToJs } from "./css-to-js";

export async function transform(
  props: BabelTransformerArgs
): Promise<BabelTransformerArgs> {
  if (!props.filename.match(/\.css$/)) {
    return props;
  }
  // Is a CSS module
  if (props.filename.match(/\.module(\.(native|ios|android|web))?\.css$/)) {
    return transformCssModule(props);
  }

  // Standard CSS
  return transformCssToJs(props);
}
