import { Image, ImageProps } from "react-native";

export default function BetterImage(props: ImageProps & { alt?: string }) {
  return (
    <Image
      {...props}
      accessibilityLabel={props.alt ?? props.accessibilityLabel}
    />
  );
}
