import { polyfillMapping } from "./polyfill/mapping";

export function render(
  jsx: Function,
  type: any,
  props: Record<string | number, unknown>,
  key: string,
  experimentalFeatures = false
) {
  const cssInterop = polyfillMapping.get(type);
  if (cssInterop && !props.__skipCssInterop) {
    return cssInterop(jsx, type, props, key, experimentalFeatures);
  } else {
    return jsx(type, props, key);
  }
}
