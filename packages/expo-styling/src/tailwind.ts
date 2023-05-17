import type { ConfigT } from "metro-config";
import path from "path";
import { build as twBuild } from "tailwindcss/lib/cli/build";

export function withTailwind(
  config: ConfigT,
  {
    input = path.relative(process.cwd(), "./global.css"),
    output = path.resolve(process.cwd(), "node_modules/.cache/expo/global.css"),
  } = {}
) {
  const getTransformOptions = async (
    entryPoints: any,
    options: any,
    getDependenciesOf: any
  ) => {
    process.stdout.clearLine(0);

    await twBuild({
      "--input": input,
      "--output": output,
      "--watch": options.dev ? "always" : false,
      "--poll": true,
    });

    return config.transformer?.getTransformOptions?.(
      entryPoints,
      options,
      getDependenciesOf
    );
  };

  return {
    ...config,
    resolver: {
      ...config.resolver,
      sourceExts: [...config.resolver.sourceExts, "css"],
    },
    transformerPath: require.resolve("@expo/styling/transformer"),
    transformer: {
      ...config.transformer,
      getTransformOptions,
      externallyManagedCss: {
        [input]: output,
      },
    },
  };
}
