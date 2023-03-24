import type { BabelTransformerArgs } from "metro-babel-transformer";

export async function transform(
  props: BabelTransformerArgs
): Promise<BabelTransformerArgs> {
  // Strip out the API files from the bundle when not targetting Node.js runtimes.
  if (props.filename.match(/\+api(\.(native|ios|android|web))?\.[tj]sx$/)) {
    if (props.options?.customTransformOptions?.environment !== "node") {
      props.src = "";
    } else {
      // noop
    }
  }

  return props;
}
