import { BabelTransformerArgs } from "metro-babel-transformer";
import { transformCssToJs } from "./css-to-js";

export async function transformCssModuleWeb(
  props: BabelTransformerArgs
): Promise<BabelTransformerArgs> {
  const { transform } = await import("lightningcss");

  // TODO: Add bundling to resolve imports
  // https://lightningcss.dev/bundling.html#bundling-order

  const cssResults = transform({
    filename: props.filename,
    code: Buffer.from(props.src),
    sourceMap: false,
    cssModules: {
      dashedIdents: true,
    },
    // cssModules: true,
    projectRoot: props.options.projectRoot,
    minify: props.options.minify,
  });
  const codeAsString = cssResults.code.toString();

  const cssProps = transformCssToJs({
    ...props,
    src: codeAsString,
  });

  const { styles: rnwStylesObject, variables } =
    convertLightningCssToReactNativeWebStyleSheet(cssResults.exports!);

  props.src = `${cssProps.src}
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create(${JSON.stringify(rnwStylesObject)});

export default { ...styles, ...${JSON.stringify(variables)} }`;

  return props;
}

export function convertLightningCssToReactNativeWebStyleSheet(
  input: import("lightningcss").CSSModuleExports
) {
  console.log("RES>", JSON.stringify(input));
  const styles: Record<string, any> = {};
  const variables: Record<string, string> = {};
  // e.g. { container: { name: 'ahs8IW_container', composes: [], isReferenced: false }, }
  Object.entries(input).map(([key, value]) => {
    // order matters here
    let className = value.name;

    if (value.composes.length) {
      className += " " + value.composes.map((value) => value.name).join(" ");
    }

    // CSS Variables will be `{string: string}`
    if (key.startsWith("--")) {
      variables[key] = className;
    }

    styles[key] = { $$css: true, c: className };
    return {
      [key]: { $$css: true, c: className },
    };
  });

  return { styles, variables };
}

export async function transformCssModuleNative(
  props: BabelTransformerArgs
): Promise<BabelTransformerArgs> {
  const transform = await import("css-to-react-native-transform");
  // TODO: Native
  props.src =
    "export default " +
    JSON.stringify(
      transform.default(props.src, {
        parseMediaQueries: true,
      })
    );
  return props;
}

export async function transformCssModule(
  props: BabelTransformerArgs
): Promise<BabelTransformerArgs> {
  if (!matchCssModule(props.filename)) return props;

  if (props.options.platform === "web") {
    return transformCssModuleWeb(props);
  }
  return transformCssModuleNative(props);
}

export function matchCssModule(filePath: string): boolean {
  return !!/\.module(\.(native|ios|android|web))?\.css$/.test(filePath);
}
