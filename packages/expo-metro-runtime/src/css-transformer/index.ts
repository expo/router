// import css2rn from "css-to-react-native-transform";

export async function transform(props: {
  filename: string;
  src: string;
  options: any;
}) {
  if (props.filename.endsWith(".css")) {
    // Is a CSS module
    if (props.filename.match(/\.module(\.(native|ios|android|web))?\.css$/)) {
      // TODO: Support CSS modules
      props.src = `module.exports = {}`;
    } else {
      if (props.options.platform === "web") {
        // TODO: Id with filename for refreshing
        props.src = `module.exports = (() => {
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            const css = \`${props.src}\`;
            style.setAttribute('data-metro', 'css');
            head.appendChild(style);
            if (style.styleSheet){
              // This is required for IE8 and below.
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
