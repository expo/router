import "./wrap-native";

export function render(
  jsx: Function,
  type: any,
  props: Record<string | number, unknown>,
  key: string
) {
  if (typeof type.cssInterop === "function") {
    return jsx(type, type.cssInterop(props), key);
  } else {
    return jsx(type, props, key);
  }
}

export function defaultCSSInterop(props: Record<string, unknown>) {
  if (typeof props.className === "string") {
    const classNameStyle = { $$css: true, [props.className]: props.className };
    props.style = Array.isArray(props.style)
      ? [classNameStyle, ...props.style]
      : props.style
      ? [classNameStyle, props.style]
      : classNameStyle;

    delete props.className;
  }

  return props;
}
