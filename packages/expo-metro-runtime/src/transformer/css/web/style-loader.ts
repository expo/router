// style-loader from webpack

import path from "path";

export async function transformAsync(props: {
  filename: string;
  src: string;
  options: {
    singleton?: boolean;
    hot?: boolean;
    projectRoot: string;
  };
}): Promise<string> {
  const runtimeModule = path.join(
    __dirname,
    "runtime/injectStylesIntoStyleTag.js"
  );

  const importPath = path.relative(props.options.projectRoot, runtimeModule);

  // TODO: Skip the runtime conversion to StyleSheet
  return `import api from ${JSON.stringify(importPath)};
${props.src.replace("export default ___CSS_LOADER_EXPORT___;", "")}

const update = api(___CSS_LOADER_EXPORT___, { singleton: false });

const next = Object.entries(___CSS_LOADER_EXPORT___.locals).reduce((acc, [key, value]) => {
  acc[key] = {
    $$css: true,
    "class": value
  }
  return acc;
}, {});

import { StyleSheet } from 'react-native';
___CSS_LOADER_EXPORT___.locals = StyleSheet.create(next);

export default ___CSS_LOADER_EXPORT___.locals || {};`;
}
