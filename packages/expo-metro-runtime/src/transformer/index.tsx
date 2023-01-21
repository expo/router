import upstreamTransformer from "metro-react-native-babel-transformer";

import * as CssTransformer from "./css/css-transformer";

export async function transform(props) {
  // Then pass it to the upstream transformer.
  return upstreamTransformer.transform(
    // Transpile CSS first.
    await CssTransformer.transform(props)
  );
}
