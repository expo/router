export function render(
  jsx: Function,
  type: any,
  props: Record<string | number, unknown>,
  key: string
) {
  if (!props.__skipCssInterop && typeof type.cssInterop === "function") {
    return type.cssInterop(jsx, type, props, key);
  } else {
    return jsx(type, props, key);
  }
}
