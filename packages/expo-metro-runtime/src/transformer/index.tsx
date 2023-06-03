import type { BabelTransformerArgs } from "metro-babel-transformer";
import upstreamTransformer from "metro-react-native-babel-transformer";

import * as CssTransformer from "./css/css-transformer";

export async function transform(props: BabelTransformerArgs) {
  if (
    props.options.platform !== "web" &&
    props.filename.match(/\+dom(\.(native|ios|android|web))?\.[tj]sx$/)
  ) {
    return upstreamTransformer.transform({
      ...props,

      // Clear dom files on native
      src: "export default function Page() { return null; }",
    });
  }

  // Then pass it to the upstream transformer.
  return upstreamTransformer.transform(
    // Transpile CSS first.
    props
  );
}
