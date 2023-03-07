declare module "metro-react-native-babel-transformer" {
  import { BabelTransformer } from "metro-babel-transformer";
  export function transform(
    args: Parameters<BabelTransformer["transform"]>
  ): ReturnType<BabelTransformer["transform"]>;

  export function getCacheKey(): string;
}
