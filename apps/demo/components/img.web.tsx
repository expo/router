import { Image, ImageProps } from "expo-image";

// expo-image doesn't support accessibility props on web :[
export default function BetterImage(
  props: ImageProps & { alt?: string; width?: number; height?: number }
) {
  const { width, height, style, ...rest } = props;
  return (
    <Image
      {...rest}
      style={[style, { width, height }]}
      accessibilityLabel={props.alt ?? props.accessibilityLabel}
    />
  );
}
