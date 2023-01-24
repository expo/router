// import css2rn from "css-to-react-native-transform";

function pathToHtmlSafeName(path: string) {
  return path.replace(/[^a-zA-Z0-9_]/g, "_");
}

function getHotReplaceTemplate(id: string) {
  // In dev mode, we need to replace the style tag instead of appending it
  // use the path as the data-expo-dev-id attribute to find the style tag
  // to replace.
  const attr = JSON.stringify(pathToHtmlSafeName(id));
  console.log("attr", attr);
  return `
style.setAttribute('data-expo-dev-id', ${attr});
const previousStyle = document.querySelector(\`[data-expo-dev-id="\${${attr}}"]\`);
if (previousStyle) {
    previousStyle.parentNode.removeChild(previousStyle);
}
`;
}

export async function transform(props: {
  filename: string;
  src: string;
  options: {
    platform: string;
    dev: boolean;
    hot: boolean;
    inlinePlatform: boolean;
  };
}) {
  if (props.filename.endsWith(".css")) {
    // Is a CSS module
    if (props.filename.match(/\.module(\.(native|ios|android|web))?\.css$/)) {
      // TODO: Support CSS modules
      props.src = `module.exports = {}`;
    } else {
      if (props.options.platform === "web") {
        const dev = props.options.dev;
        props.src = `module.exports = (() => {
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            const css = \`${props.src}\`;
            ${dev ? getHotReplaceTemplate(props.filename) : ``}
            style.setAttribute('data-expo-loader', 'css');
            head.appendChild(style);
            if (style.styleSheet){
              style.styleSheet.cssText = css;
            } else {
              style.appendChild(document.createTextNode(css));
            }
          })();`;
      } else {
        // shim on native
        props.src = `module.exports = {}`;
      }
    }
  }
  return props;
}
