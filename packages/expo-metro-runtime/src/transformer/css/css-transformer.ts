import { transformAsync } from "./web";
import { transformAsync as transformStyleAsync } from "./web/style-loader";

import type { BabelTransformerArgs } from "metro-babel-transformer";

export function matchCssModule(filename: string): boolean {
  return !!filename.match(/\.module(\.(native|ios|android|web))?\.css$/);
}

export async function transform(
  props: BabelTransformerArgs
): Promise<BabelTransformerArgs> {
  if (props.filename.endsWith(".css")) {
    // Is a CSS module
    if (props.filename.match(/\.module(\.(native|ios|android|web))?\.css$/)) {
      // TODO: Support CSS modules

      if (props.options.platform === "web") {
        props.src = await transformAsync(
          props.src,
          {
            importLoaders: 1,
            modules: true,
          },
          {
            filename: props.filename,
            projectRoot: props.options.projectRoot,
            sourceMap: null,
          }
        );
        props.src = await transformStyleAsync(props);
      } else {
        const transform = require("css-to-react-native-transform")
          .default as typeof import("css-to-react-native-transform").default;
        // TODO: Native
        props.src =
          "module.exports = " +
          JSON.stringify(
            transform(props.src, {
              parseMediaQueries: true,
            })
          );
      }
      // TODO: Support CSS modules
      //       if (props.options.dev) {
      //         props.src = `// TODO(EvanBacon): CSS modules are not supported in Metro yet.
      // // File: ${props.filename}
      // module.exports = {}`;
      //       } else {
      //         props.src = `module.exports = {}`;
      //       }

      //       if (props.options.dev) {
      //         props.src = `// TODO(EvanBacon): CSS modules are not supported in Metro yet.
      // // File: ${props.filename}
      // module.exports = {}`;
      //       } else {
      //         props.src = `module.exports = {}`;
      //       }
    } else {
      if (props.options.platform === "web") {
        const dev = props.options.dev;
        props.src = `
(() => {
  if (typeof document === 'undefined') {
    return
  }
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  ${dev ? getHotReplaceTemplate(props.filename) : ``}
  style.setAttribute('data-expo-loader', 'css');
  head.appendChild(style);
  const css = \`${props.src}\`;
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
})();`;
      } else {
        // shim on native
        if (props.options.dev) {
          props.src = `// DEBUG: Global CSS is not supported on native platforms.
// File: ${props.filename}`;
        } else {
          props.src = ``;
        }
      }
    }
  }
  return props;
}
export function pathToHtmlSafeName(path: string) {
  return path.replace(/[^a-zA-Z0-9_]/g, "_");
}

export function getHotReplaceTemplate(id: string) {
  // In dev mode, we need to replace the style tag instead of appending it
  // use the path as the expo-css-hmr attribute to find the style tag
  // to replace.
  const attr = JSON.stringify(pathToHtmlSafeName(id));
  return `
  style.setAttribute('data-expo-css-hmr', ${attr});
  const previousStyle = document.querySelector(\`[data-expo-css-hmr="\${${attr}}"]\`);
  if (previousStyle) {
      previousStyle.parentNode.removeChild(previousStyle);
  }`;
}
