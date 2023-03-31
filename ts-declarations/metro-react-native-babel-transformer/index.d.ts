declare module "metro-react-native-babel-transformer" {
  import {
    BabelTransformer,
    BabelTransformerArgs,
  } from "metro-babel-transformer";
  export function transform(
    args: BabelTransformerArgs
  ): ReturnType<BabelTransformer["transform"]>;

  export function getCacheKey(): string;
}
