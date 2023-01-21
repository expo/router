const upstreamTransformer = require("metro-react-native-babel-transformer");
const CssTransformer = require("@expo/metro-runtime/build/css-transformer");

module.exports.transform = async (props) => {
  // Then pass it to the upstream transformer.
  return upstreamTransformer.transform(
    // Transpile CSS first.
    await CssTransformer.transform(props)
  );
};
