export function defaultCSSInterop(
  jsx: Function,
  type: any,
  props: Record<string | number, unknown>,
  key: string
) {
  if (typeof props.className === "string") {
    const classNameStyle = { $$css: true, [props.className]: props.className };
    props.style = Array.isArray(props.style)
      ? [classNameStyle, ...props.style]
      : props.style
      ? [classNameStyle, props.style]
      : classNameStyle;

    delete props.className;
  }

  return jsx(type, props, key);
}
